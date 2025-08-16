import React, { useState, useEffect, useRef } from 'react';

const SectionHeader = ({ children, className }) => (
  <h2 className={`text-4xl font-bold mb-8 ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
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
        { time: '6:00 PM', event: 'Check-in Begins (Ends at 8:00 PM)', location: 'Levering Hall - Glass Pavilion', duration: 2},
        { time: '6:30 PM', event: 'Dinner (TBD)', location: 'Levering Hall - Glass Pavilion', duration: 1},
        { time: '8:00 PM', event: 'Opening Ceremony', location: 'Levering Hall - Glass Pavilion', duration: 0.5},
        { time: '8:45 PM', event: 'Team Building', location: 'Levering Hall - Glass Pavilion', duration: 0.25},
        { time: '9:00 PM', event: 'Sponsor Hall Opens', location: 'Levering Hall - Great Hall', duration: 0},
        { time: '9:00 PM', event: 'Hacking Begins!', location: 'Hodson', duration: 0},
        { time: '11:00 PM', event: 'Sleeping Rooms Open', location: 'Hodson', duration: 0 },
        { time: '11:00 PM', event: 'Levering Hall Closes', location: 'Levering Hall', duration: 0 }
      ]
    },
    sat: {
      title: 'Saturday, Sep 13',
      events: [
        { time: '9:00 AM', event: 'Breakfast (TBD)', location: 'Levering Hall - Glass Pavilion', duration: 0.5 },
        { time: '2:00 PM', event: 'Lunch (TBD)', location: 'Levering Hall - Glass Pavilion', duration: 1 },
        { time: '8:00 PM', event: 'Dinner', location: 'Levering Hall - Glass Pavilion', duration: 1.5 },
        { time: '11:00 PM', event: 'Levering Hall Closes', location: 'Levering Hall', duration: 0 }
      ]
    },
    sun: {
      title: 'Sunday, Sep 14',
      events: [
        { time: '8:30 AM', event: 'Submissions Due (Soft Deadline)', location: 'Devpost', duration: 0.15 },
        { time: '8:45 AM', event: 'All Coding Stops (Hard Deadline)', location: 'Devpost', duration: 0 },
        { time: '9:00 AM', event: 'Breakfast', location: 'Levering Hall - Great Hall', duration: 1 },
        { time: '9:00 AM', event: 'Sleeping Rooms Close', location: 'Hodson 203', duration: 0 },
        { time: '10:00 AM', event: 'Presentations Fair', location: 'Hodson', duration: 2 },
        { time: '12:00 PM', event: 'Lunch', location: 'Levering Hall - Great Hall', duration: 0.5 },
        { time: '1:15 PM', event: 'Top 10 Demos & Judging', location: 'Hodson Hall - Auditorium (Hodson 110)', duration: 1.25 },
        { time: '2:30 PM', event: 'Awards & Closing Ceremony', location: 'Hodson Hall - Auditorium (Hodson 110)', duration: 0.5 }
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
      const scrollPosition = (firstEventTime / (24 * 60)) * 1440 - 50; // 1440px is total height, offset by 50px
      scheduleRef.current.scrollTop = Math.max(0, scrollPosition);
    }
  };

  useEffect(() => {
    // Small delay to ensure the component has rendered
    const timer = setTimeout(scrollToFirstEvent, 100);
    return () => clearTimeout(timer);
  }, [selectedDay]);

  const getEventColor = (event, index) => {
    return 'bg-blue-400';
  };

  const calculateOptimalTimeGridWidth = () => {
    if (!currentSchedule.events.length) return 8; // 8rem default
    
    const maxBubbleHeight = Math.max(
      ...currentSchedule.events.map(event => Math.max(event.duration * 60, 30))
    );
    
    // Base width of 8rem, add 1rem for every 60px of bubble height
    const baseWidth = 8;
    const additionalWidth = Math.floor(maxBubbleHeight / 60) * 1;
    return Math.min(baseWidth + additionalWidth, 16); // Cap at 16rem
  };

  // Function to calculate layout positions to avoid overlaps
  const calculateEventLayout = (events) => {
    const eventsWithLayout = events.map((event, index) => ({
      ...event,
      index,
      startMinutes: timeToMinutes(event.time),
      heightMinutes: Math.max(event.duration * 60, 30)
    }));

    // Sort events by start time
    eventsWithLayout.sort((a, b) => a.startMinutes - b.startMinutes);

    // Track occupied columns
    const columns = [];
    
    eventsWithLayout.forEach(event => {
      event.endMinutes = event.startMinutes + event.heightMinutes;
      
      // Find the first available column
      let columnIndex = 0;
      while (columnIndex < columns.length) {
        const column = columns[columnIndex];
        // Check if this event overlaps with any event in this column
        const hasOverlap = column.some(existingEvent => 
          event.startMinutes < existingEvent.endMinutes && 
          event.endMinutes > existingEvent.startMinutes
        );
        
        if (!hasOverlap) {
          break;
        }
        columnIndex++;
      }
      
      // If we need a new column, create it
      if (columnIndex >= columns.length) {
        columns.push([]);
      }
      
      // Add event to the column
      event.column = columnIndex;
      event.totalColumns = Math.max(columns.length, columnIndex + 1);
      columns[columnIndex].push(event);
    });

    // Update totalColumns for all events
    const maxColumns = columns.length;
    eventsWithLayout.forEach(event => {
      event.totalColumns = maxColumns;
    });

    return eventsWithLayout;
  };

  // Function to calculate dynamic text size based on bubble dimensions and content
  const calculateTextSize = (event, widthPercentage, heightPixels) => {
    const contentLength = event.event.length + event.location.length;
    
    // Base size calculations
    let timeSize = 'text-xs';
    let eventSize = 'text-xs';
    let locationSize = 'text-xs';
    
    // Only increase size for larger bubbles
    if (heightPixels >= 60 && widthPercentage >= 60) {
      timeSize = 'text-sm';
      eventSize = 'text-sm';
    } else if (heightPixels >= 45 && widthPercentage >= 45) {
      timeSize = 'text-xs';
      eventSize = 'text-xs';
    }
    
    // For very small bubbles, use even smaller text
    if (heightPixels < 35 || widthPercentage < 30) {
      timeSize = 'text-xs';
      eventSize = 'text-xs';
      locationSize = 'text-xs';
    }
    
    return { timeSize, eventSize, locationSize };
  };

  const timeGridWidth = calculateOptimalTimeGridWidth();
  const eventsWithLayout = calculateEventLayout(currentSchedule.events);

  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <SectionHeader className="text-center">Schedule</SectionHeader>

      <div 
        className="rounded-3xl overflow-hidden shadow-2xl"
        style={{
          background: '#FFB300',
        }}
      >
        <div className="grid grid-cols-3 gap-0">
          {Object.entries(scheduleData).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedDay(key)}
              className={`p-6 text-white font-bold text-xl transition-all duration-300 ${
                selectedDay === key 
                  ? 'bg-black bg-opacity-20 shadow-inner' 
                  : 'hover:bg-black hover:bg-opacity-10'
              }`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {data.title}
            </button>
          ))}
        </div>

        <div 
          ref={scheduleRef}
          className="grid grid-cols-1 relative overflow-y-auto"
          style={{
            background: '#FFE194',
            height: '400px' // Decreased from minHeight: '600px'
          }}
          onClick={(e) => {
            // Click outside any event to close tooltip
            if (e.target === e.currentTarget || e.target.closest('.absolute.w-full.border-t')) {
              setClickedEvent(null);
            }
          }}
        >
          <div className="absolute left-0 top-0 h-full" style={{ width: `${timeGridWidth}rem` }}> {/* Increased from w-24 */}
            {timeSlots.filter(slot => slot.minute === 0).map((slot, index) => (
              <div
                key={index}
                className="absolute text-sm font-semibold text-gray-700"
                style={{
                  top: `${(slot.hour * 60)}px`, // Changed to fixed pixel height (60px per hour)
                  fontFamily: 'Inter, sans-serif'
                }}
              >
                {slot.time12}
              </div>
            ))}
          </div>

          {timeSlots.filter(slot => slot.minute === 0).map((slot, index) => (
            <div
              key={index}
              className="absolute w-full border-t border-gray-300"
              style={{
                top: `${(slot.hour * 60)}px`, // Changed to fixed pixel height (60px per hour)
                left: `${timeGridWidth}rem`
              }}
            />
          ))}

          <div className="relative" style={{ marginLeft: `${timeGridWidth}rem`, height: '1440px' }}> {/* Increased margin and set fixed height (24 hours * 60px) */}
            {eventsWithLayout.map((event) => {
              const topPixels = event.startMinutes; // 1 pixel per minute
              const heightPixels = event.heightMinutes;
              
              // Calculate width and position based on column layout
              const widthPercentage = event.totalColumns > 1 ? 90 / event.totalColumns : 90;
              const leftPercentage = event.totalColumns > 1 ? 
                2 + (event.column * (90 / event.totalColumns)) : 2;
              
              // Calculate dynamic text sizes
              const { timeSize, eventSize, locationSize } = calculateTextSize(event, widthPercentage, heightPixels);
              
              // Format display text as "Time: Event Name"
              const displayText = `${event.time}: ${event.event}`;
              const isClicked = clickedEvent === event.index;
              
              return (
                <div key={event.index} className="relative">
                  {/* Main Event Bubble */}
                  <div
                    className={`absolute rounded-lg text-white shadow-lg ${getEventColor(event, event.index)} hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer ${isClicked ? 'ring-2 ring-white ring-opacity-50' : ''}`}
                    style={{
                      top: `${topPixels}px`,
                      height: `${heightPixels}px`,
                      width: `${widthPercentage}%`,
                      left: `${leftPercentage}%`,
                      zIndex: isClicked ? 20 : 10,
                      padding: heightPixels < 40 ? '4px' : '8px'
                    }}
                    onClick={() => setClickedEvent(isClicked ? null : event.index)}
                  >
                    <div className="h-full w-full flex items-center justify-center text-center">
                      <div 
                        className={`font-semibold ${eventSize} leading-tight overflow-hidden`} 
                        style={{ 
                          fontFamily: 'Inter, sans-serif',
                          display: '-webkit-box',
                          WebkitLineClamp: heightPixels < 40 ? 2 : heightPixels < 60 ? 3 : 4,
                          WebkitBoxOrient: 'vertical',
                          wordBreak: 'break-word'
                        }}
                      >
                        {displayText}
                      </div>
                    </div>
                  </div>

                  {/* Location Tooltip/Bubble */}
                  {isClicked && (
                    <div
                      className="absolute bg-gray-800 text-white px-3 py-2 rounded-lg shadow-xl border-2 border-white z-30 min-w-max"
                      style={{
                        top: `${topPixels + heightPixels + 8}px`,
                        left: `${leftPercentage}%`,
                        maxWidth: '200px',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <div className="text-xs font-medium">Location:</div>
                      <div className="text-sm font-semibold">{event.location}</div>
                      {/* Small arrow pointing up */}
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
        </div>
      </div>
    </div>
  );
};

export default Schedule;