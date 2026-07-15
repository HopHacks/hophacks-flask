"use client";

/**
 * Dev-only preview of the profile page: no login, no Flask, no Mongo.
 * Mocks the handful of API endpoints the page uses via an axios adapter,
 * seeded with a legacy-shaped profile (lowercase values, missing fields)
 * to exercise the schema-drift handling. Returns 404 in production builds.
 *
 * Visit http://localhost:3000/profile/preview
 */

import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { ProfileForm } from "../ProfileForm";
import { ResumeSection } from "../ResumeSection";

// Legacy-shaped (pre-2026) sample: old key names (`grad`, `ethnicity` —
// renamed to `level_of_study`, `race_ethnicity`), option values not in the
// current MLH enums, `age`/`linkedin_url` missing, plus fields the form
// doesn't edit (pfp) that must survive saves.
let mockProfile: Record<string, unknown> = {
  first_name: "Ada",
  last_name: "Lovelace",
  gender: "Male",
  major: "Computer Science",
  phone_number: "4105550123",
  school: "Johns Hopkins University",
  ethnicity: "Asian/Pacific Islander",
  grad: "Post Doctorate",
  is_jhu: true,
  grad_month: "05",
  grad_year: "2026",
  country: "United States",
  first_hackathon: "Yes",
  first_hophacks: "No",
  learn_about_us: "Friend",
  pfp: "0_1_1_0_0_0",
};

let mockResumeName = "";

async function mockAdapter(
  config: InternalAxiosRequestConfig,
): Promise<AxiosResponse> {
  const url = config.url ?? "";
  const method = (config.method ?? "get").toLowerCase();
  const respond = (data: unknown): AxiosResponse => ({
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  });

  if (url.includes("/api/accounts/profile/get")) {
    return respond({ profile: mockProfile });
  }
  if (url.includes("/api/accounts/profile/update")) {
    mockProfile = JSON.parse(String(config.data)).profile;
    console.log("[profile preview] saved profile:", mockProfile);
    return respond({ msg: "updated!" });
  }
  if (url.includes("/api/resumes/filename")) {
    return respond({ filename: mockResumeName });
  }
  if (url.includes("/api/resumes/")) {
    if (method === "post") {
      const file = (config.data as FormData).get("file");
      mockResumeName = file instanceof File ? file.name : "resume.pdf";
      // Mimic the backend's quirky `jsonify(body, code)` array shape so the
      // unwrap logic in ResumeSection gets exercised.
      return respond([{ msg: "file uploaded" }, 200]);
    }
    if (mockResumeName) return respond({ url: "about:blank" });
    return respond([{ msg: "no resume uploaded!" }, 404]);
  }

  // Anything else (e.g. the auth refresh loop) fails like a dead backend.
  return Promise.reject(new Error(`[profile preview] no mock for ${url}`));
}

function Preview() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = axios.interceptors.request.use((config) => {
      config.adapter = mockAdapter;
      return config;
    });
    setReady(true);
    return () => axios.interceptors.request.eject(id);
  }, []);

  // Children mount only after the interceptor exists, so their fetches hit
  // the mock instead of the (absent) real backend.
  if (!ready) return null;

  return (
    <div className="flex flex-col items-center justify-center bg-[url('https://hophacks-website.s3.us-east-1.amazonaws.com/images/auth/auth_bg.png')] bg-cover min-h-dvh py-10">
      <div
        className="min-w-[300px] max-w-[900px] w-[90%] flex flex-col rounded-2xl p-10 m-5"
        style={{ backgroundColor: "rgba(0, 29, 76, 0.9)" }}
      >
        <div className="flex items-start justify-between mb-6">
          <h2
            className="text-5xl font-bold text-white"
            style={{ fontVariant: "small-caps" }}
          >
            Your Profile
          </h2>
          <span className="text-sm font-semibold text-[#ffb51f] border border-[#ffb51f] rounded-full px-3 py-1">
            preview — mock data
          </span>
        </div>

        <ProfileForm />

        <hr className="my-8 border-white/20" />

        <ResumeSection />
      </div>
    </div>
  );
}

export default function ProfilePreviewPage() {
  if (process.env.NODE_ENV === "production") notFound();
  return <Preview />;
}
