import { getCollegeDetailsApi } from '@/functions';
import { useState, useEffect, Fragment } from 'react';



const CollegeDropdowns = ({ selectedCourse, selectedStream, onCourseChange, onStreamChange }) => {
  const [collegeData, setCollegeData] = useState(null);
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    fetchCollegeData();
  }, []); 

  const fetchCollegeData = async () => {
    try {
      const response = await getCollegeDetailsApi(304); 
      console.log(response);
      setCollegeData(response);
    } catch (error) {
      console.error('Error fetching college data:', error);
    }
  };

  useEffect(() => {
    const selectedCourseData = collegeData?.data.college_courses.find(course => course.name === selectedCourse);
    if (selectedCourseData) {
      setStreams(selectedCourseData.streams || []);
    } else {
      setStreams([]);
    }
  }, [selectedCourse, collegeData]);

  const handleCourseChange = (e) => {
    const currCourse = e.target.value;

    const currcourseData = collegeData?.data.college_courses.find(course => currCourse === course.name)

    if(!currcourseData || !currcourseData.streams || currcourseData.streams.length === 0) onStreamChange('');

    onCourseChange(currCourse);
   
  };

  const handleStreamChange = (e) => {
    onStreamChange(e.target.value);

  };

  if (!collegeData) {
    return(<p>loading...</p>)
  }

  const courseOptions = collegeData?.data.college_courses.map(course => (
    <option key={course.code} value={course.name}>{course.name}</option>
  ));

  const streamOptions = streams.map(stream => (
    <option key={stream._id} value={stream.name}>{stream.name}</option>
  ));

  return (
    <Fragment>
      <div className='filters-dropdowns'>   
        <label htmlFor="courseDropdown">Select Course:</label>
        <select id="courseDropdown" value={selectedCourse} onChange={handleCourseChange}>
          <option value="" disabled>Please select the course</option>
          {courseOptions}
        </select>

        <br />

        {streams.length>0 && (
          <>
        
            <label htmlFor="streamDropdown">Select Stream:</label>
            <select id="streamDropdown" value={selectedStream} onChange={handleStreamChange}>
              <option value="" disabled>Please select the stream</option>
              {streamOptions}
            </select>
            </>
        )}
      </div>
    </Fragment>
  );
};

export default CollegeDropdowns;
