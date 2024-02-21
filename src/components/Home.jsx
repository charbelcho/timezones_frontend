import styles from "../style";
import { useState, useEffect } from "react";
import axios from "axios";

import 'react-calendar/dist/Calendar.css';
import { weekdaysIndexToGerShort } from "../constants";
import { IoCalendarNumberOutline } from "react-icons/io5";
import EventModal from "./EventModal";

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [toggle, setToggle] = useState(false);
  const [toggle2, setToggle2] = useState(false);
  const [allCities, setAllCities] = useState([]);
  const [citiesFound, setCitiesFound] = useState([]);
  const [citiesSaved, setCitiesSaved] = useState([]);
  const [nowUTC, setNowUTC] = useState(new Date());

  useEffect(() => {
    let arr = []
    for (let i = 0; i < 10; i++) {
      if (localStorage.getItem(`${i}`) !== null) {
        arr.push(JSON.parse(localStorage.getItem(`${i}`)))
      }
    }
    setCitiesSaved(arr)
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {  //assign interval to a variable to clear it.
      let t1 = new Date()
      setNowUTC(new Date(t1.getUTCFullYear(), t1.getUTCMonth(), t1.getUTCDate(), t1.getUTCHours(), t1.getUTCMinutes(), t1.getUTCSeconds()))
    }, 2000)//2000 = 2 Sekunden

    return () => clearInterval(intervalId); //This is important

  }, [nowUTC])


  useEffect(() => {
    if (allCities.length === 0) {
      axios.get('http://localhost:3000/')
        .then((response) => {
          setAllCities(response.data)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, []);

  const containsSubstring = (text, substring) => {
    if (substring === null || substring === '' || substring === undefined) {
      return false
    }
    return text.toLowerCase().includes(substring.toLowerCase());
  }

  const handleInputChange = (event) => {
    const arr = []
    setSearchTerm(event.target.value);
    if (event.target.value.length > 0) {
      setToggle(true)
      for (const element of allCities) {
        if (
          containsSubstring(element.Name, event.target.value) ||
          containsSubstring(element.CountryGerman, event.target.value) ||
          containsSubstring(`${element.Name}, ${element.CountryGerman}`, event.target.value)
        ) {
          if (arr.length < 5) {
            arr.push(element)
          }
        }
      }
      setCitiesFound(arr)
    } else {
      setCitiesFound([])
      setToggle(false)
    }
  };

 

  const storeLocalStorage = (city) => {
    const arr = []
    for (let i = 0; i < 10; i++) {
      if (localStorage.getItem(`${i}`) !== null) {
        arr.push(JSON.parse(localStorage.getItem(`${i}`)))
      }
      else if (localStorage.getItem(`${i}`) === null) {
        localStorage.setItem(`${i}`, JSON.stringify(city))
        arr.push(JSON.parse(localStorage.getItem(`${i}`)))
        setCitiesSaved(arr)
        return
      }
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (citiesFound.length === 1) {
      axios.get(`http://localhost:3000/${citiesFound[0].Name}/${citiesFound[0].CountryGerman}/`)
        .then((response) => {
          storeLocalStorage(response.data)
        })
        .catch((error) => {
          console.log(error)
        });
      setSearchTerm("")
      setToggle(false)
      event.target.value = ""
    }
  }

  const onInputClick = (city, country) => {
    axios.get(`http://localhost:3000/${city}/${country}/`)
      .then((response) => {
        storeLocalStorage(response.data)
      })
      .catch((error) => {
        console.log(error)
      })
    setSearchTerm("")
    setCitiesFound([])
    setToggle(false)
  }

  const deleteCity = (index) => {
    const arr = []
    localStorage.removeItem(`${index}`)
    for (let i = index; i < 10; i++) {
      if (localStorage.getItem(`${i + 1}`) === null) {
        continue
      } else {
        localStorage.setItem(`${i}`, localStorage.getItem(`${i + 1}`))
        localStorage.removeItem(`${i + 1}`)
      }
    }
    for (let i = 0; i < 10; i++) {
      if (localStorage.getItem(`${i}`) !== null) {
        arr.push(JSON.parse(localStorage.getItem(`${i}`)))
      }
      else {
        break
      }
    }
    setCitiesSaved(arr)
  }

  const openEventModal = () => {
    setToggle2(!toggle2)
  }

  const calculateDateTime = (utcTime, offset) => {
    let date = new Date(utcTime)
    date.setHours(utcTime.getHours() + offset)
    return [date.getHours(), date.getMinutes(), date.getDay(), date.getDate(), date.getMonth()]
  }

  return (
    <section id="home" className={`flex md:flex-row flex-col ${styles.paddingY}`}>
      <div className={`flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-6`}>
        <div className="flex w-full flex-row items-center py-[6px] px-4 bg-discount-gradient rounded-[10px] mb-2">
          <div>
            {/* <button className="btn" onClick={() => test()}>Hallo</button> */}
            
          </div>
          <span className="w-full">
            <div className="flex flex-row my-1 w-full bg-primary rounded">
              <form className="shadow-md px-4 pt-2 pb-2"
                onSubmit={handleSubmit}>

                <input
                  className="custom-input xxs:w-full ss:w-[300px] appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="stadt"
                  type="text"
                  placeholder="Stadt"
                  value={searchTerm}
                  onChange={handleInputChange}
                  autoFocus={true} />
                <div className={`${!toggle ? "hidden" : "flex"
                  } w-[300px] shadow bg-discount-gradient rounded-bottom citylist display:none`}>
                  <ul className="w-full">
                    {citiesFound.map((item, index) => (
                      <div key={index}>
                        <li
                          className="rounded citylist-item py-1 px-3"
                          onClick={() => onInputClick(item.Name, item.CountryGerman)}>{item.Name}, {item.CountryGerman}</li>
                        <div className={index !== citiesFound.length - 1 ? "divider-vertical": ""}></div>
                      </div>
                    ))}
                  </ul>
                </div>

              </form>

              <div className="flex flex-col">
                <button className={`${toggle2 ? "border-lila" : ""} btn p-2 diplay-grid-center h-full`} onClick={() => openEventModal()}>
                  <IoCalendarNumberOutline className="text-[22px]" />
                </button>
                <EventModal show={toggle2} toggle={openEventModal}/>
              </div>



            </div>
            <div className="bg-primary flex flex-col w-full rounded">
              {citiesSaved.map((item, index) => (
                <div key={index}>
                  <div className="flex flex-row w-full py-2">
                    <div className="flex flex-col w-[20px] display-grid-center"><button className="delete-button" onClick={() => deleteCity(index)}><b>x</b></button></div>
                    <div className="flex flex-col w-[250px]"><b>{item != null ? item.data.city : ""}</b><small>{item != null ? item.data.countryGerman : ""}</small></div>
                    <div className="flex flex-col w-[120px]">
                      <b>
                        {calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[0] < 10 ? `0${calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[0]}` : calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[0]}
                        :
                        {calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[1] < 10 ? `0${calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[1]}` : calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[1]}
                      </b>
                      <small>
                        {item != null ? weekdaysIndexToGerShort[calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[2]] : ""},
                        {calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[3] < 10 ? ` 0${calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[3]}` : (' ' + calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[3])}.
                        {calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[4] + 1 < 10 ? `0${calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[4] + 1}` : calculateDateTime(nowUTC, item.data.currentUtcOffset.hours)[4] + 1}.
                      </small>
                    </div>
                  </div>
                  <div className={index !== citiesSaved.length - 1 ? "divider-vertical" : ""}></div>
                </div>
              ))}
            </div>
          </span>
        </div>
      </div>
    </section>

  )
}

export default Home