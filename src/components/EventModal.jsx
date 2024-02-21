import { useEffect, useState } from "react"
import PropTypes from 'prop-types';
import * as ics from 'ics'

const EventModal = (props) => {
  const [toggle2, setToggle2] = useState(false);
  const [eventTitle, setEventTitle] = useState('')
  const [eventOrt, setEventOrt] = useState('')
  const [eventStartDate, setEventStartDate] = useState('')
  const [eventStartTime, setEventStartTime] = useState('')
  const [eventEndDate, setEventEndDate] = useState('')
  const [eventEndTime, setEventEndTime] = useState('')

  useEffect(() => {
    let t1 = new Date()
    let t2 = new Date(t1)
    t2.setMinutes(t2.getMinutes() + 30)
    let t3 = `${t1.getFullYear()}-${t1.getMonth() + 1 < 10 ? '0' + String(t1.getMonth() + 1) : t1.getMonth() + 1}-${t1.getDate() < 10 ? '0' + String(t1.getDate()) : t1.getDate()}`
    let t4 = `${t1.getHours() < 10 ? '0' + String(t1.getHours()) : t1.getHours()}:${t1.getMinutes() < 10 ? '0' + String(t1.getMinutes()) : t1.getMinutes()}`
    let t5 = `${t2.getFullYear()}-${t2.getMonth() + 1 < 10 ? '0' + String(t2.getMonth() + 1) : t2.getMonth() + 1}-${t2.getDate() < 10 ? '0' + String(t2.getDate()) : t2.getDate()}`
    let t6 = `${t2.getHours() < 10 ? '0' + String(t2.getHours()) : t2.getHours()}:${t2.getMinutes() < 10 ? '0' + String(t2.getMinutes()) : t2.getMinutes()}`
    setEventStartDate(t3)
    setEventStartTime(t4)
    setEventEndDate(t5)
    setEventEndTime(t6)
  }, [props.show])

  const handleInputChangeEvent = (event) => {
    if (event.target.id === "title") {
      setEventTitle(event.target.value)
    } else if (event.target.id === "ort") {
      setEventOrt(event.target.value)
    } else if (event.target.id === "startDate") {
      setEventStartDate(event.target.value)
      console.log(event.target.value)
    } else if (event.target.id === "startTime") {
      setEventStartTime(event.target.value)
      console.log(event.target.value)
    } else if (event.target.id === "endDate") {
      setEventEndDate(event.target.value)
    } else if (event.target.id === "endTime") {
      setEventEndTime(event.target.value)
    }
  };

  const speicherEvent = () => {
    let start = new Date(eventStartDate + 'T' + eventStartTime)
    let end = new Date(eventEndDate + 'T' + eventEndTime)
    let duration = calculateDurationInHandMin(start, end)

    createCalendarEvent(start, duration, eventTitle, eventOrt)
    resetEventInfo()
  }

  const resetEventInfo = () => {
    props.toggle()
    setEventTitle('')
    setEventOrt('')
    setEventStartDate('')
    setEventStartTime('')
    setEventEndDate('')
    setEventEndTime('')
  }

  const calculateDurationInHandMin = (start, end) => {
    let duration = end - start
    return duration / (1000 * 60)
  }

  const createCalendarEvent = (start, duration, title, ort) => {
    let event = {
      start: [start.getFullYear(), start.getMonth() + 1, start.getDate(), start.getHours(), start.getMinutes()],
      duration: { minutes: duration },
      title: title,
      location: ort,
    }

    ics.createEvent(event, (error, value) => {
      if (error) {
        console.log(error)
        return
      }

      let blob = new Blob([value], {
        type: 'text/calendar;charset=utf8',
        encoding: 'UTF-8',
      })
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = "event-info.json";
      link.href = url;
      link.click();
    })
  }

  return (
    <div className={`${!props.show ? "hidden": "flex"} flex-col mt-[50px] rounded px-3 btn-popup bg-primary`}>
      <form>
        <div className="flex flex-row w-full display-grid-center mt-2">
          <h6 className="">Neues Ereignis</h6>
        </div>
        <div className="flex flex-row w-full mt-2">
          <div className="flex flex-col w-full">
            <input
              className="custom-input appearance-none custom-border rounded py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="title"
              type="text"
              placeholder="Titel"
              value={eventTitle}
              onChange={handleInputChangeEvent}
              autoFocus={true} />
          </div>
        </div>
        <div className="flex flex-row w-full mt-2">
          <div className="flex flex-col w-full">
            <input
              className="custom-input  appearance-none custom-border rounded py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="ort"
              type="text"
              placeholder="Ort"
              value={eventOrt}
              onChange={handleInputChangeEvent}
              autoFocus={false} />
          </div>
        </div>
        <div className="flex flex-row w-full mt-2">
          <div className="flex flex-col mr-2">
            <input
              className="custom-input w-[140px] appearance-none custom-border rounded py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="startDate"
              type="date"
              placeholder="DD.MM.YYYY"
              value={eventStartDate}
              onChange={handleInputChangeEvent}
              autoFocus={false} />
          </div>
          <div className="flex flex-col">
            <input
              className="custom-input w-[65px] appearance-none custom-border rounded py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="startTime"
              type="time"
              placeholder="00:00"
              value={eventStartTime}
              onChange={handleInputChangeEvent}
              autoFocus={false} />
          </div>
        </div>
        <div className="flex flex-row w-full mt-2">
          <div className="flex flex-col mr-2">
            <input
              className="custom-input w-[140px] appearance-none custom-border rounded py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="endDate"
              type="date"
              placeholder="DD.MM.YYYY"
              value={eventEndDate}
              onChange={handleInputChangeEvent}
              autoFocus={false} />
          </div>
          <div className="flex flex-col">
            <input
              className="custom-input w-[65px] appearance-none custom-border rounded py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="endTime"
              type="time"
              placeholder="00:00"
              value={eventEndTime}
              onChange={handleInputChangeEvent}
              autoFocus={false} />
          </div>
        </div>
      </form>

      <div className="flex flex-row w-full mt-4 space-between">
        <div className="flex flex-col">
          <button className="btn event-button bg-red px-2 py-2" onClick={() => resetEventInfo()}>Abbrechen</button>
        </div>
        <div className="flex flex-col">
          <button
            className="btn event-button bg-green px-2 py-2"
            onClick={() => speicherEvent()}>Speichern</button>
        </div>
      </div>
    </div>
  )
}

export default EventModal