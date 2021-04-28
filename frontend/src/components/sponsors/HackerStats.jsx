// import React, { Component } from 'react';
// import { Row, Col } from 'antd';
// import $ from 'jquery/dist/jquery.js';
// import PieChart from 'react-minimal-pie-chart';

// export default class HackerStats extends Component {
//     componentDidMount() {
//         $('.count').each(function () {
//             $(this).prop('Counter', 0).animate({
//                 Counter: $(this).text(),
//             }, {
//                 duration: 3000,
//                 easing: 'swing',
//                 step: function (now) {
//                     $(this).text(Math.ceil(now));
//                 },
//             });
//         });
//     }

//     render() {
//         return (
//             <div id="hacker-section" className="card light-theme lighten blue-text center-wrapper" style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'center' }}>
//                 <div className="card-content" style={{ textAlign: 'center' }}>
//                     <div className="card-title center-wrapper ">
//                         <span className="quadon blue-text" >Statistics</span>
//                     </div>
//                     <div
//                         className="blue-line"
//                         style={{
//                             margin: 'auto', marginBottom: '6px',
//                         }}
//                     />
//                     <h3> If you're curious about what kind of students you can reach by sponsoring us </h3>
//                     <div style={{ margin: '50px 8vw' }} >

//                         <Row gutter={12} style={{ marginBottom: '16px' }}>
//                             <Col xs={24} lg={12}>
//                                 <div
//                                     style={{
//                                         margin: 'auto', textAlign: 'center', marginBottom: '16px',
//                                     }}
//                                 >
//                                     <h3 style={{ color: '#2196F3' }}><b> Spring 2019 schools with most participants </b></h3>
//                                     <ul style={{ listStyleType: 'none', paddingLeft: '0px', color: 'black' }}>
//                                         <li> Johns Hopkins University: <span className="count" style={{ color: '#2196F3' }}>168</span></li>
//                                         <li> University of Maryland:  <span className="count" style={{ color: '#2196F3' }}>32</span></li>
//                                         <li> UMBC:  <span className="count" style={{ color: '#2196F3' }}>14</span></li>
//                                         <li> Loyola:  <span className="count" style={{ color: '#2196F3' }}>9</span></li>
//                                         <li> Georgetown:  <span className="count" style={{ color: '#2196F3' }}>7</span></li>
//                                     </ul>
//                                 </div>
//                             </Col>


//                             <Col xs={24} lg={12}>
//                                 <div
//                                     style={{
//                                         margin: 'auto', textAlign: 'center', marginBottom: '16px',
//                                     }}
//                                 >
//                                     <h1 className="count" style={{ color: '#2196F3' }}>635</h1>
//                                     <h3>Total hackers in the 2018-2019 season</h3>
//                                 </div>
//                             </Col>
//                         </Row>

//                         <Row gutter={16} style={{ marginBottom: '16px' }}>
//                             <Col xs={24} lg={12}>
//                                 <div
//                                     style={{
//                                         margin: 'auto', textAlign: 'center', marginBottom: '16px',
//                                     }}
//                                 >
//                                     <h3 style={{ color: '#2196F3' }}> <b> Spring 2019 most common majors</b> </h3>
//                                     <ul style={{ listStyleType: 'none', paddingLeft: '0px', color: 'black' }}>
//                                         <li> Computer Science:  <span className="count" style={{ color: '#2196F3' }}>151</span></li>
//                                         <li> Electrical/Computer Engineering:  <span className="count" style={{ color: '#2196F3' }}>19</span></li>
//                                         <li> Biomedical Engineering:  <span className="count" style={{ color: '#2196F3' }}>25</span></li>
//                                     </ul>
//                                 </div>
//                             </Col>

//                             <Col xs={24} lg={12}>
//                                 <div
//                                     style={{
//                                         margin: 'auto', textAlign: 'center', marginBottom: '16px',
//                                     }}
//                                 >
//                                     <PieChart
//                                         data={[
//                                             { title: '', value: 26, color: '#bddafb' },
//                                             { title: '', value: 74, color: '#253371' },
//                                         ]}
//                                         animate
//                                         animationDuration={3000}
//                                         style={{ width: '50px', display: 'inline-block', margin: '0px 10px' }}
//                                     />
//                                     <h1 style={{ color: '#2196F3', display: 'inline' }}><span className="count" >26</span>%</h1>
//                                     <h3>Female hackers in Spring 2019</h3>
//                                 </div>
//                             </Col>
//                         </Row>
//                     </div>
//                 </div>
//             </div>
//         );
//     }
// }