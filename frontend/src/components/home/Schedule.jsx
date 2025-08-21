import React, { useState, useEffect, useRef } from 'react';

const SectionHeader = ({ children, className }) => (
  <h2 className={`text-4xl font-bold mb-8 ${className}`} style={{ fontFamily: 'Montserrat' }}>
    {children}
  </h2>
);

const Schedule = () => {
  const [selectedDay, setSelectedDay] = useState('fri');
  const [clickedEvent, setClickedEvent] = useState(null);
  const scheduleRef = useRef(null);

  const scheduleData = {
    fri: {
      title: 'Friday, Sep 12',
      events: [
        {
          time: '6:00 PM',
          event: 'Check-in',
          location: 'Levering Hall - Glass Pavilion',
          duration: 2,
          emoji: '💫',
          type: 'main'
        },
        {
          time: '6:30 PM',
          event: 'Dinner',
          location: 'Levering Hall - Glass Pavilion',
          duration: 1.5,
          emoji: '🍕',
          type: 'food'
        },
        {
          time: '8:00 PM',
          event: 'Opening Ceremony',
          location: 'Levering Hall - Glass Pavilion',
          duration: 0.75,
          emoji: '🎉',
          type: 'main'
        },
        {
          time: '8:45 PM',
          event: 'Team Building',
          location: 'Levering Hall - Glass Pavilion',
          duration: 0.25,
          emoji: '🤝',
          type: 'main'
        },
        {
          time: '9:00 PM',
          event: 'Workshops TBA!',
          location: 'TBD',
          duration: 3,
          emoji: '🛠️',
          type: 'workshop'
        },
        // {
        //   time: '9:00 PM',
        //   event: 'Sponsor Hall Opens',
        //   location: 'Levering Hall - Great Hall',
        //   duration: 0,
        //   type: 'announcement'
        // },
        {
          time: '9:00 PM',
          event: 'Hacking Begins!',
          location: 'Hodson',
          duration: 0,
          type: 'announcement'
        },
        // {
        //   time: '11:00 PM',
        //   event: 'Sleeping Rooms Open',
        //   location: 'Hodson',
        //   duration: 0,
        //   type: 'announcement'
        // },
        {
          time: '11:00 PM',
          event: 'Sponsors Hall Closes',
          location: 'Levering Hall',
          duration: 0,
          type: 'announcement'
        }
      ]
    },
    sat: {
      title: 'Saturday, Sep 13',
      events: [
        {
          time: '9:00 AM',
          event: 'Breakfast',
          location: 'Levering Hall - Glass Pavilion',
          duration: 1,
          emoji: '🥞',
          type: 'food'
        },
        {
          time: '9:00 AM',
          event: 'Workshops TBA!',
          location: 'TBD',
          duration: 14,
          emoji: '🛠️',
          type: 'workshop'
        },
        {
          time: '2:00 PM',
          event: 'Lunch',
          location: 'Levering Hall - Glass Pavilion',
          duration: 1.5,
          emoji: '🌯',
          type: 'food'
        },
        {
          time: '8:00 PM',
          event: 'Dinner',
          location: 'Levering Hall - Glass Pavilion',
          duration: 2,
          emoji: '🍕',
          type: 'food'
        },
        {
          time: '11:00 PM',
          event: 'Sponsors Hall Closes',
          location: 'Levering Hall',
          duration: 0,
          type: 'announcement'
        }
      ]
    },
    sun: {
      title: 'Sunday, Sep 14',
      events: [
        {
          time: '8:30 AM',
          event: 'Submissions Due (Soft Deadline)',
          location: 'Devpost',
          duration: 0,
          type: 'announcement'
        },
        // {
        //   time: '8:45 AM',
        //   event: 'All Coding Stops (Hard Deadline)',
        //   location: 'Devpost',
        //   duration: 0,
        //   type: 'announcement'
        // },
        {
          time: '9:00 AM',
          event: 'Breakfast',
          location: 'Levering Hall - Great Hall',
          duration: 1,
          emoji: '🥞',
          type: 'food'
        },
        // { time: '9:00 AM', event: 'Sleeping Rooms Close', location: 'Hodson 203', duration: 0 },
        {
          time: '10:00 AM',
          event: 'Science Fair',
          location: 'Hodson',
          duration: 2,
          emoji: '🚀',
          type: 'main'
        },
        {
          time: '12:00 PM',
          event: 'Lunch',
          location: 'Levering Hall - Great Hall',
          duration: 1,
          emoji: '🌯',
          type: 'food'
        },
        {
          time: '1:15 PM',
          event: 'Top 10 Demos & Judging',
          location: 'Hodson Hall - Auditorium (Hodson 110)',
          duration: 1.25,
          emoji: '🌟',
          type: 'main'
        },
        {
          time: '2:30 PM',
          event: 'Awards & Closing Ceremony',
          location: 'Hodson Hall - Auditorium (Hodson 110)',
          duration: 0.5,
          emoji: '🏆',
          type: 'main'
        }
      ]
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour < 12 ? 'AM' : 'PM';
        const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
        slots.push({ time24, time12, hour, minute });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const currentSchedule = scheduleData[selectedDay];

  const timeToMinutes = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
  };

  const scrollToFirstEvent = () => {
    if (currentSchedule.events.length > 0 && scheduleRef.current) {
      const firstEventTime = timeToMinutes(currentSchedule.events[0].time);
      const scrollPosition = (firstEventTime / (24 * 60)) * 1440 - 50;
      scheduleRef.current.scrollTop = Math.max(0, scrollPosition);
    }
  };

  useEffect(() => {
    const timer = setTimeout(scrollToFirstEvent, 100);
    return () => clearTimeout(timer);
  }, [selectedDay]);

  const getEventColor = () => {
    return 'bg-blue-400';
  };

  const getDayStartOffset = (dayKey) => {
    if (dayKey === 'fri') return 16 * 60; // 4 PM
    return 8 * 60; // 8 AM
  };

  const calculateEventLayout = (events, dayKey) => {
    const startOffset = getDayStartOffset(dayKey);
    const eventsWithLayout = events.map((event, index) => ({
      ...event,
      index,
      startMinutes: timeToMinutes(event.time) - startOffset,
      heightMinutes: Math.max(event.duration * 60, 30)
    }));

    eventsWithLayout.sort((a, b) => a.startMinutes - b.startMinutes);

    const columns = [];

    eventsWithLayout.forEach((event) => {
      event.endMinutes = event.startMinutes + event.heightMinutes;

      let columnIndex = 0;
      while (columnIndex < columns.length) {
        const column = columns[columnIndex];
        const hasOverlap = column.some(
          (existingEvent) =>
            event.startMinutes < existingEvent.endMinutes &&
            event.endMinutes > existingEvent.startMinutes
        );

        if (!hasOverlap) {
          break;
        }
        columnIndex++;
      }

      if (columnIndex >= columns.length) {
        columns.push([]);
      }

      event.column = columnIndex;
      event.totalColumns = Math.max(columns.length, columnIndex + 1);
      columns[columnIndex].push(event);
    });
    const maxColumns = columns.length;
    eventsWithLayout.forEach((event) => {
      event.totalColumns = maxColumns;
    });

    return eventsWithLayout;
  };

  const eventsWithLayout = calculateEventLayout(currentSchedule.events, selectedDay);

  const getTimeSlotsForDay = (dayKey) => {
    if (dayKey === 'fri') {
      return timeSlots.filter((slot) => slot.minute === 0 && slot.hour >= 16);
    }
    if (dayKey === 'sun') {
      return timeSlots.filter((slot) => slot.minute === 0 && slot.hour >= 8 && slot.hour <= 16);
    }
    return timeSlots.filter((slot) => slot.minute === 0 && slot.hour >= 8);
  };

  const getScheduleHeight = (dayKey) => {
    if (dayKey === 'fri') return (24 - 16) * 60; // 4 PM to midnight = 8 hours = 480px
    if (dayKey === 'sun') return (16 - 8) * 60; // 8 AM to 4 PM = 8 hours = 480px
    return (24 - 8) * 60; // 8 AM to midnight = 16 hours = 960px
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <SectionHeader className="text-center text-white">Schedule</SectionHeader>

      <div
        className="rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: 'bg-blue-900'
        }}
      >
        <div className="flex w-full">
          {Object.entries(scheduleData).map(([key, data], idx, arr) => (
            <React.Fragment key={key}>
              <button
                onClick={() => setSelectedDay(key)}
                className={`flex-1 p-6 font-bold text-xl transition-all duration-300 ${
                  selectedDay === key
                    ? 'bg-yellow-500 FFE194 text-white shadow-inner'
                    : 'bg-blue-900 text-white hover:FFE194'
                }`}
                style={{ fontFamily: 'Montserrat' }}
              >
                {data.title}
              </button>
              {/* Add vertical divider except after last button */}
              {idx < arr.length - 1 && (
                <div className="flex items-center justify-center">
                  <div className="h-12 w-0.5 bg-white opacity-40 mx-auto" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex w-full gap-4 pl-4 pr-4 pt-4 pb-4 bg-yellow-500">
          {['⏰ Time', '📣 Announcement', '💠 Main', '🍽️ Food', '🛠️ Workshop'].map((type) => (
            <div key={type} className="flex-1 rounded-xl bg-white border-t border-blue-800">
              <div
                className="text-center text-lg font-bold text-gray-700 mb-2"
                style={{ fontFamily: 'Montserrat' }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-full" style={{ minHeight: `${getScheduleHeight(selectedDay)}px` }}>
          {/* Scrollable schedule grid */}
          <div
            ref={scheduleRef}
            className="relative overflow-y-auto"
            style={{
              background: '#FFE194',
              height: `${getScheduleHeight(selectedDay)}px`,
              flex: 1
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget || e.target.closest('.absolute.w-full.border-t')) {
                setClickedEvent(null);
              }
            }}
          >
            {/* Time grid lines */}
            {getTimeSlotsForDay(selectedDay).map((slot, index) => (
              <div
                key={index}
                className="absolute w-full border-t border-yellow-500"
                style={{
                  top: `${(slot.hour - (selectedDay === 'fri' ? 16 : selectedDay === 'sun' ? 8 : 8)) * 60}px`
                }}
              />
            ))}

            {/* Event columns */}
            <div
              className="relative flex w-full"
              style={{ height: `${getScheduleHeight(selectedDay)}px` }}
            >
              {/* Time column */}
              <div className="relative flex-1 border-l border-yellow-500 bg-[#FFE194]">
                {getTimeSlotsForDay(selectedDay).map((slot, index) => (
                  <div
                    key={index}
                    className="absolute text-sm font-semibold text-gray-700"
                    style={{
                      top: `${(slot.hour - (selectedDay === 'fri' ? 16 : selectedDay === 'sun' ? 8 : 8)) * 60}px`,
                      left: '10%',
                      width: '80%',
                      fontFamily: 'Montserrat'
                    }}
                  >
                    {slot.time12}
                  </div>
                ))}
              </div>

              {/* Other event columns */}
              {['announcement', 'main', 'food', 'workshop'].map((type) => (
                <div key={type} className="relative flex-1 border-l border-blue-800">
                  {eventsWithLayout
                    .filter((event) => event.type === type)
                    .map((event) => {
                      const topPixels = event.startMinutes;
                      const heightPixels = event.heightMinutes;
                      const displayText = `${event.emoji ? event.emoji + ' ' : ''}${event.time}: ${event.event}`;
                      const isClicked = clickedEvent === event.index;

                      // Announcements as icon bubbles
                      if (event.type === 'announcement') {
                        return (
                          <div
                            key={event.index}
                            className="absolute flex items-center gap-2 px-3 py-2 rounded-full bg-yellow-500 text-white shadow-lg"
                            style={{
                              top: `${topPixels - 10}px`,
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 'fit-content',
                              zIndex: 30,
                              fontFamily: 'Montserrat'
                            }}
                          >
                            <span
                              role="img"
                              aria-label="announcement"
                              style={{ fontSize: '1.2em' }}
                            >
                              📢
                            </span>
                            <span className="font-semibold">{displayText}</span>
                          </div>
                        );
                      }

                      // Regular event block
                      return (
                        <div key={event.index} className="relative">
                          <div
                            className={`absolute rounded-lg text-white shadow-lg border-2 border-white-900 ${getEventColor(event, event.index)} hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${isClicked ? 'border-2 border-blue-900' : ''}`}
                            style={{
                              top: `${topPixels}px`,
                              height: `${heightPixels}px`,
                              left: '10%',
                              width: '80%',
                              zIndex: isClicked ? 20 : 10,
                              padding: heightPixels < 40 ? '4px' : '8px'
                            }}
                            onClick={() => setClickedEvent(isClicked ? null : event.index)}
                          >
                            <div className="h-full w-full flex items-center justify-center text-center">
                              <div
                                className={`font-semibold leading-tight overflow-hidden`}
                                style={{
                                  fontFamily: 'Montserrat',
                                  display: '-webkit-box',
                                  WebkitLineClamp:
                                    heightPixels < 40 ? 2 : heightPixels < 60 ? 3 : 4,
                                  WebkitBoxOrient: 'vertical',
                                  wordBreak: 'break-word'
                                }}
                              >
                                {displayText}
                              </div>
                            </div>
                          </div>
                          {isClicked && (
                            <div
                              className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl border-2 border-white z-30 min-w-max"
                              style={{
                                top: `${topPixels + heightPixels + 8}px`,
                                left: '10%',
                                maxWidth: '200px',
                                fontFamily: 'Montserrat'
                              }}
                            >
                              <div className="text-xs font-medium">Location:</div>
                              <div className="text-sm font-semibold">{event.location}</div>
                              <div
                                className="absolute w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"
                                style={{
                                  top: '-4px',
                                  left: '12px'
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
