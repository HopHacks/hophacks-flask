export interface TeamMember {
  name: string;
  role?: string;
  github?: string;
  linkedin?: string;
  hometown?: string;
  major?: string;
  year?: string;
  funFact?: string;
  // Local override for members without a photo in the old S3 bucket
  // (falls back to nameToPhotoUrl(name) when unset).
  photo?: string;
}

export interface Subteam {
  name: string;
  defaultRole: string;
  members: TeamMember[];
}

// 2026-27 active roster, sourced from the "2026 Organizer Contacts" sheet
// and "Team Bios" doc.
export const TEAMS: Subteam[] = [
  {
    name: "Directors",
    defaultRole: "Directors",
    members: [
      {
        name: "Chelsea Wong",
        role: "Director",
        github: "https://github.com/cheollie",
        linkedin: "https://www.linkedin.com/in/chelseawong07/",
        hometown: "Toronto, Canada",
        funFact:
          "I've met a couple of Olympic figure skaters (and got their autographs)!",
        major: "Biomedical Engineering and Computer Science",
        year: "2028",
      },
      {
        name: "Joanne Li",
        role: "Director",
        linkedin: "https://www.linkedin.com/in/-joanneli-",
        hometown: "Rockville, Maryland",
        funFact: "I practice wushu (Chinese martial arts)!",
        major: "Biomedical Engineering",
        year: "2028",
      },
      { name: "Joanne Selinski", role: "Faculty Advisor" },
      { name: "Lyn Doan", role: "Faculty Advisor" },
      { name: "Ali Madooei", role: "Faculty Advisor" },
      { name: "Abigail Fanara", role: "Faculty Advisor" },
    ],
  },
  {
    name: "Design",
    defaultRole: "Design",
    members: [
      {
        name: "Angela Guo",
        role: "Design Lead",
        github: "https://github.com/angelag13",
        linkedin: "https://www.linkedin.com/in/angelaguo13",
        hometown: "Herndon",
        funFact: "I do not like cheese!",
        major: "Computer Science ",
        year: "2027",
      },
      {
        name: "Emily Zou",
        hometown: "Puerto Rico",
        funFact: "I love going to concerts",
        major: "Computer Science",
        year: "2027",
      },
      {
        name: "Michael Schmalz",
        photo: "/images/team/michael-schmalz.jpg",
        funFact:
          "Michael is a rising sophomore majoring in Computer Science and Applied Math. He's also a member of the Quant Club and enjoys working out, playing soccer, and playing poker.",
      },
    ],
  },
  {
    name: "Logistics",
    defaultRole: "Logistics",
    members: [
      {
        name: "Grace Xu",
        photo: "/images/team/grace-xu.jpg",
        funFact:
          "Grace is a sophomore studying Computer Science. In her free time, she enjoys crocheting, discovering new music, and cafe hopping!",
      },
      {
        name: "Kevin Hwang",
        photo: "/images/team/kevin-hwang.jpg",
        funFact:
          "Kevin is a sophomore studying computer science and applied math and statistics. He is a member of Semester.ly. In his free time, he likes hiking and eating good food.",
      },
      {
        name: "Leah Triantos",
        photo: "/images/team/leah-triantos.jpg",
        funFact:
          "Leah is a rising sophomore studying computer science, with a focus on applying ML to healthcare and women's health. Outside of CS, she enjoys playing drums with her rock band, trying new restaurants, and looking at bugs and fashion on pinterest.",
      },
      {
        name: "Tanya Nair",
        photo: "/images/team/tanya-nair.jpg",
        funFact:
          "Tanya is a rising sophomore studying computer engineering. In her free time she likes reading sci-fi, trying out new restaurants/cafes, and hunting for old watches to fix on eBay.",
      },
    ],
  },
  {
    name: "Marketing",
    defaultRole: "Marketing",
    members: [{ name: "Laverna Yang" }],
  },
  {
    name: "Sponsors",
    defaultRole: "Sponsors",
    members: [
      {
        name: "Dhrithi Obla",
        photo: "/images/team/dhrithi-obla.jpg",
        funFact:
          "Dhrithi is a rising sophomore studying biomedical and electrical engineering. In her downtime she loves hanging out with her fellow JHU Shakti members, listening to Daniel Caesar, and trying new cooking recipes!",
      },
      {
        name: "Mikhail Zhernevskii (Misha)",
        funFact:
          "Misha is a rising sophomore studying computer science and applied math. He's also part of ACM and the Quant Club. In his free time, he enjoys running, skiing, and fire spinning.",
      },
      {
        name: "Nhan Tran",
        photo: "/images/team/nhan-tran.jpg",
        funFact:
          "Hi I'm a sophomore studying computer science at Hopkins. In my free time I enjoy playing basketball, hiking, and ordering popeyes.",
      },
    ],
  },
  {
    name: "Website",
    defaultRole: "Website",
    members: [
      { name: "Jayden Moon", role: "Website Advisor" },
      {
        name: "David Benjamin",
        role: "Website Lead",
        github: "https://github.com/DavidBenj15",
        linkedin: "https://www.linkedin.com/in/david-benjamin-9b342b290/",
        hometown: "Philadelphia, PA",
        funFact: "My dog's name is LeBron",
        major: "Computer Science",
        year: "2027",
      },
      {
        name: "Ronit Sohal",
        github: "https://github.com/ronitsohal05",
        linkedin: "https://www.linkedin.com/in/ronit-sohal-b13857258/",
        hometown: "Miami, FL",
        funFact: "I love eating food",
        major: "Computer Science",
        year: "2028",
      },
      {
        name: "Wendy Xiao",
        linkedin: "https://www.linkedin.com/in/wendy-xiao-82a441285/",
        hometown: "Bellevue, Washington",
        funFact: "Apples blended with milk is a really tasty drink..",
        major: "Computer Science and Applied Mathematics and Statistics",
        year: "2028",
      },
      { name: "Christian Yoon" },
      {
        name: "Naavya Jain",
        photo: "/images/team/naavya-jain.jpg",
        funFact:
          "Naavya is a rising sophomore studying computer science. She enjoys listening to music, going for walks outside, or trying new recipes during her free time.",
      },
      {
        name: "Spencer Ye",
        photo: "/images/team/spencer-ye.jpg",
        funFact:
          "Spencer is a rising senior majoring in Computer Science as part of the BS/MSE program. He runs track for the school team and is the President of the ACM chapter. He also enjoys golfing, reading, and djing in his free-time.",
      },
    ],
  },
];
