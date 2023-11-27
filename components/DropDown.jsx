
import { useState, useEffect, Fragment } from 'react';



const CollegeDropdowns = ({ selectedCourse, selectedStream, onCourseChange, onStreamChange, maincollegeData,onSearchChange
 }) => {
  const [collegeData, setCollegeData] = useState(maincollegeData);
  const [streams, setStreams] = useState([]);
  const [searchQuery,setSearchQuery] = useState('');

  // useEffect(() => {
  //   fetchCollegeData();
  // }, []); 

  // const fetchCollegeData = async () => {
  //   try {
  //     const response = await getCollegeDetailsApi(304); 
  //     console.log(response);
  //     setCollegeData(response);
  //   } catch (error) {
  //     console.error('Error fetching college data:', error);
  //   }
  // };

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

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };


  const courseOptions = collegeData?.data.college_courses.map(course => (
    <option key={course.code} value={course.name}>{course.name}</option>
  ));

  const streamOptions = streams?.map(stream => (
    <option key={stream._id} value={stream.name}>{stream.name}</option>
  ));

  return (
    <Fragment>
      <div className='filtering--comps'>
        <div className='filter--search'>
        <label htmlFor="searchBox">Search:</label>
        <input className='search-input'
          type="text"
          id="searchBox"
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        </div>
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
      </div>
    </Fragment>
  );
};

export default CollegeDropdowns;
