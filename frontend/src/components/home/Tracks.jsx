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
              The challenge prompt from IAA will be released when the hackathon starts!
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
              BGB Group challenges hackers to bring their ideas to life using a challenge prompt
              that will be released when the hackathon starts!
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
              CBID will challenge participants to follow a project prompt that will be released
              soon!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tracks;
