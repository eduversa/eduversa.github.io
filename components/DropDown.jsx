
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
    const newCourse = e.target.value;

 
    if (newCourse === "NA") {
      onCourseChange(""); 
      onStreamChange(""); 
    } else {
      const selectedCourseData =
        collegeData?.data.college_courses.find(
          (course) => course.name === newCourse
        ) || {};

      onCourseChange(newCourse);
      setStreams(selectedCourseData.streams || []);
    }
   
  };

  const handleStreamChange = (e) => {
    const newStream = e.target.value;

  
    if (newStream === "NA") {
      onStreamChange(""); 
    } else {
      onStreamChange(newStream);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange(query);
  };


  const courseOptions = [
    <option key="NA" value="NA">
      NA
    </option>,
    ...collegeData?.data.college_courses.map((course) => (
      <option key={course.code} value={course.name}>
        {course.name}
      </option>
    ))
  ];

 const streamOptions = [
    <option key="NA" value="NA">
      NA
    </option>,
    ...streams?.map((stream) => (
      <option key={stream._id} value={stream.name}>
        {stream.name}
      </option>
    ))
  ];

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
