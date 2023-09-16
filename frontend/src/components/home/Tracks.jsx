import styled from 'styled-components';
import Box from '@material-ui/core/Box';

const Title = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: rgba(255, 255, 255);
`;
function img(url) {
  return 'https://hophacks-website.s3.amazonaws.com' + '/images/' + url;
}

const Tracks = () => {
  return (
    <div className="tracks" id="tracks">
      <div className="text-container">
        <Box flex={1} align="center">
          <Title>Tracks</Title>
        </Box>
        <div className="general-track">
          <div className="title">General Track</div>
          <div className="body">
            Open to all HopHacks hackers! Take this open-ended opportunity to collaborate alongside
            others of all skills and experience levels and hack to your heart’s desire.
          </div>
        </div>
        <img className="keyboard" src={img('keyboard.png')} />
        <div className="patient-track">
          <img
            src={img('sponsor/png/PaitentSafety.png')}
            style={{ width: '360px' }}
            className="sponsor-img"
          />
          <div className="body">
            <div>
              The Patient Safety Technology Challenge engages with students to build solutions
              focused on avoiding medical error and reducing preventable patient harm. Bring your
              software or hardware ideas to life by aligning it to one of the following problem
              categories and help reimagine tech-enabled healthcare systems.
              <br />
              <br />
              Medication-related
              <br />
              Medical Complications with Patient Care
              <br />
              Procedure/Surgery-Related
              <br />
              Infections
              <br />
              Diagnostic Errors
              <br />
              <br />
            </div>
          </div>
        </div>
        <img className="guitar" src={img('guitar.png')} />
        <div className="jhuiaa-track">
          <img
            src={img('sponsor/png/jhuiaa.webp')}
            style={{ width: '300px' }}
            className="sponsor-img"
          />
          <div className="body">
            <div>
              <br />
              JHU’s Institute for Assured Autonomy is a national center of excellence, ensuring the
              safe, secure, reliable, and predictable integration of artificial intelligence and
              autonomous systems into society.
              <br />
              <br />
              Prompt: Create a generative AI-based grading system for detecting lies and
              mis/disinformation
            </div>
          </div>
        </div>
        <img className="bass" src={img('bass.png')} />
        <div className="patient-track">
          <img
            src={img('sponsor/png/bgb-white.png')}
            style={{ width: '300px' }}
            className="sponsor-img"
          />
          <div className="body" style={{ textAlign: 'center' }}>
            <div>
              BGB Group is a healthcare communications agency partnering with biopharmaceutical
              clients, creating opportunities to share compelling and credible stories of
              transformative science.
              <br />
              <br />
              Prompt 1: Optimally implementing health equity into clinical trials:
              <br />
              Identify a way to increase clinical trial recruitment from these under-presented
              populations (self sign up or through a doctors office) and a coordinated process to
              get patients to the centers.
              <br />
              Identify a way to help community centers managed increased patient flow
              <br />
              <br />
              Prompt 2: Support improved patient/HCP discussions
              <br />
              Create a software approach that allows patients to have a simulated conversation with
              doctor’s to gain confidence prior to a live doctors visit. Incorporate public data
              available that can help build the patient’s most accurate personna. Include the
              ability to record live in office conversations that can then be transcribed into
              laymen’s terms (vs heavy medical terminology). Integrate with calendars for upcoming
              appointments, treatment reminders, etc.
            </div>
          </div>
        </div>
        <img className="guitar2" src={img('guitar.png')} />
        <div className="jhuiaa-track">
          <img
            src={img('sponsor/png/cbid_track.png')}
            style={{ width: '300px' }}
            className="sponsor-img"
          />
          <div className="body">
            <div>
              <br />
              The Johns Hopkins Center for Bioengineering Innovation & Design aims to create and
              develop solutions for major challenges to human health, focusing on translational
              engineering in healthcare tech.
              <br />
              <br />
              Prompt: Integrate ML and CV into skills assessment of videos of laparoscopic surgery
              training, which will take the assessment burden off of mentors and allow trainees to
              hone their skills at a pace that matches their dedication to improvement.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracks;
