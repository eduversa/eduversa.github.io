import { Fragment,useState } from "react";

const ManageApp = ({ data }) => {
 

    const MockData = [
    {
        "personal_info": {
            "present_address": {
                "street": "Barisha, Calcutta South, Calcutta, Kolkata",
                "pincode": "700008",
                "city": "Calcutta",
                "district": "Kolkata",
                "state": "West Bengal"
            },
            "permanent_address": {
                "street": "Barisha, Calcutta South, Calcutta, Kolkata",
                "pincode": "700008",
                "city": "Calcutta",
                "district": "Kolkata",
                "state": "West Bengal"
            },
            "first_name": "Ankur",
            "last_name": "Halder",
            "gender": "Male",
            "dob": "2023-11-01T00:00:00.000Z",
            "are_addresses_same": true,
            "email": "ankur.halder12345@gmail.com",
            "contact": "+919748903490",
            "category": "GN",
            "blood_group": "A+",
            "aadhar_number": "2322 4639 5181",
            "pan_number": "HLGPM2783A"
        },
        "academic_info": {
            "admission": {
                "exam_name": "WEF41241",
                "year_of_exam": "2013",
                "roll_number": "EEEEEEEEEEEEEEE",
                "rank": "1"
            },
            "secondary": {
                "exam_name": "ACAWC",
                "year_of_exam": "2003",
                "board": "14212",
                "aggregate": "1",
                "school_name": "CAWCWQAC"
            },
            "higher_secondary": {
                "exam_name": "wreg",
                "year_of_exam": "2008",
                "board": "234234",
                "aggregate": "1",
                "school_name": "DSGWrsg"
            }
        },
        "family_info": {
            "father": {
                "first_name": "Ankur",
                "last_name": "Halder",
                "middle_name": "Student",
                "email": "ankur.halder1234567@gmail.com",
                "contact": "9748903490"
            },
            "mother": {
                "first_name": "Ankur",
                "last_name": "Halder",
                "middle_name": "Student",
                "email": "ankur.halder1234567@gmail.com",
                "contact": "9748903490"
            },
            "guardian": {
                "office_address": {
                    "street": "Barisha, Calcutta South, Calcutta, Kolkata",
                    "pincode": "700008",
                    "city": "Calcutta",
                    "district": "Kolkata",
                    "state": "West Bengal"
                },
                "first_name": "Ankur",
                "last_name": "Halder",
                "middle_name": "Student",
                "relation": "Q23E",
                "occupation": "234R235",
                "designation": "DAWD",
                "office_contact": "1234567890",
                "contact": "9748903490",
                "income": "1",
                "email": "ankur.halder1234567@gmail.com",
                "aadhar_number": "2322 4639 5181",
                "pan_number": "HLGPM2783A"
            }
        },
        "course_info": {
            "course_name": "B.TECH",
            "duration": "4",
            "stream": "CSE",
            "admission_year": "2023"
        },
        "_id": "655e11c3db3186a42e2a1a4c",
        "user_id": "2023003457",
        "createdAt": "2023-11-22T14:35:47.504Z",
        "updatedAt": "2023-11-26T14:23:33.160Z",
        "__v": 0,
        "image": "http://res.cloudinary.com/djpywdqfq/image/upload/v1701008612/tanayghoriwala001%40gmail.com_profile.png"
    },
    {
        "personal_info": {
            "present_address": {
                "street": "Barisha, Calcutta South, Calcutta, Kolkata",
                "pincode": "700008",
                "city": "Calcutta",
                "district": "Kolkata",
                "state": "West Bengal"
            },
            "permanent_address": {
                "street": "Barisha, Calcutta South, Calcutta, Kolkata",
                "pincode": "700008",
                "city": "Calcutta",
                "district": "Kolkata",
                "state": "West Bengal"
            },
            "first_name": "Tanay",
            "last_name": "Ghoriwala",
            "gender": "Male",
            "dob": "2023-11-01T00:00:00.000Z",
            "are_addresses_same": true,
            "email": "tanayghoriwala001@gmail.com",
            "contact": "+919748903490",
            "category": "GN",
            "blood_group": "A+",
            "aadhar_number": "2322 4639 5181",
            "pan_number": "HLGPM2783A"
        },
        "academic_info": {
            "admission": {
                "exam_name": "WEF41241",
                "year_of_exam": "2013",
                "roll_number": "EEEEEEEEEEEEEEE",
                "rank": "1"
            },
            "secondary": {
                "exam_name": "ACAWC",
                "year_of_exam": "2003",
                "board": "14212",
                "aggregate": "1",
                "school_name": "CAWCWQAC"
            },
            "higher_secondary": {
                "exam_name": "wreg",
                "year_of_exam": "2008",
                "board": "234234",
                "aggregate": "1",
                "school_name": "DSGWrsg"
            }
        },
        "family_info": {
            "father": {
                "first_name": "Ankur",
                "last_name": "Halder",
                "middle_name": "Student",
                "email": "ankur.halder1234567@gmail.com",
                "contact": "9748903490"
            },
            "mother": {
                "first_name": "Ankur",
                "last_name": "Halder",
                "middle_name": "Student",
                "email": "ankur.halder1234567@gmail.com",
                "contact": "9748903490"
            },
            "guardian": {
                "office_address": {
                    "street": "Barisha, Calcutta South, Calcutta, Kolkata",
                    "pincode": "700008",
                    "city": "Calcutta",
                    "district": "Kolkata",
                    "state": "West Bengal"
                },
                "first_name": "Ankur",
                "last_name": "Halder",
                "middle_name": "Student",
                "relation": "Q23E",
                "occupation": "234R235",
                "designation": "DAWD",
                "office_contact": "1234567890",
                "contact": "9748903490",
                "income": "1",
                "email": "ankur.halder1234567@gmail.com",
                "aadhar_number": "2322 4639 5181",
                "pan_number": "HLGPM2783A"
            }
        },
        "course_info": {
            "course_name": "B.TECH",
            "duration": "4",
            "stream": "CST",
            "admission_year": "2021"
        },
        "_id": "655e11c3db3186a42e2a1a4c",
        "user_id": "2023003457",
        "createdAt": "2023-11-22T14:35:47.504Z",
        "updatedAt": "2023-11-26T14:23:33.160Z",
        "__v": 0,
        "image": "http://res.cloudinary.com/djpywdqfq/image/upload/v1701008612/tanayghoriwala001%40gmail.com_profile.png"
    },
    {
        "personal_info": {
            "present_address": {
                "street": "Barisha, Calcutta South, Calcutta, Kolkata",
                "pincode": "700008",
                "city": "Calcutta",
                "district": "Kolkata",
                "state": "West Bengal"
            },
            "permanent_address": {
                "street": "Barisha, Calcutta South, Calcutta, Kolkata",
                "pincode": "700008",
                "city": "Calcutta",
                "district": "Kolkata",
                "state": "West Bengal"
            },
            "first_name": "Debargha",
            "last_name": "Mondal",
            "gender": "Male",
            "dob": "2023-11-01T00:00:00.000Z",
            "are_addresses_same": true,
            "email": "ankur.halder12345@gmail.com",
            "contact": "+919748903490",
            "category": "GN",
            "blood_group": "A+",
            "aadhar_number": "2322 4639 5181",
            "pan_number": "HLGPM2783A"
        },
        "academic_info": {
            "admission": {
                "exam_name": "WEF41241",
                "year_of_exam": "2013",
                "roll_number": "EEEEEEEEEEEEEEE",
                "rank": "1"
            },
            "secondary": {
                "exam_name": "ACAWC",
                "year_of_exam": "2003",
                "board": "14212",
                "aggregate": "1",
                "school_name": "CAWCWQAC"
            },
            "higher_secondary": {
                "exam_name": "wreg",
                "year_of_exam": "2008",
                "board": "234234",
                "aggregate": "1",
                "school_name": "DSGWrsg"
            }
        },
        "family_info": {
            "father": {
                "first_name": "Debargha",
                "last_name": "Mon",
                "middle_name": "Student",
                "email": "ankur.halder1234567@gmail.com",
                "contact": "9748903490"
            },
            "mother": {
                "first_name": "Ankur",
                "last_name": "Halder",
                "middle_name": "Student",
                "email": "ankur.halder1234567@gmail.com",
                "contact": "9748903490"
            },
            "guardian": {
                "office_address": {
                    "street": "Barisha, Calcutta South, Calcutta, Kolkata",
                    "pincode": "700008",
                    "city": "Calcutta",
                    "district": "Kolkata",
                    "state": "West Bengal"
                },
                "first_name": "Ankur",
                "last_name": "Halder",
                "middle_name": "Student",
                "relation": "Q23E",
                "occupation": "234R235",
                "designation": "DAWD",
                "office_contact": "1234567890",
                "contact": "9748903490",
                "income": "1",
                "email": "ankur.halder1234567@gmail.com",
                "aadhar_number": "2322 4639 5181",
                "pan_number": "HLGPM2783A"
            }
        },
        "course_info": {
            "course_name": "BCA",
            "duration": "4",
            "stream": "",
            "admission_year": "2023"
        },
        "_id": "655e11c3db3186a42e2a1a4c",
        "user_id": "2023003457",
        "createdAt": "2023-11-22T14:35:47.504Z",
        "updatedAt": "2023-11-26T14:23:33.160Z",
        "__v": 0,
        "image": "http://res.cloudinary.com/djpywdqfq/image/upload/v1701008612/tanayghoriwala001%40gmail.com_profile.png"
    }
    ]
   
    const [appData, setappData] = useState(MockData);
    const [filterData, setfilterData] = useState(MockData);
    



    return(
        <Fragment>

<   div>
      <h2>Data</h2>
      <ul>
        {data.map(item => (
          <li key={item._id}>
            <p>Name: {item.personal_info.first_name} {item.personal_info.last_name}</p>
            <p>Course: {item.course_info.course_name}</p>
            <p>Stream: {item.course_info.stream}</p>
          
          </li>
        ))}
      </ul>
    </div>
        </Fragment>
    )
}

export default ManageApp;