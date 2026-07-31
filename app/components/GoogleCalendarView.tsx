'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, X, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { generate2LineSummary } from '@/lib/summary';

export interface CalendarEvent {
  id: string;
  title: string;
  category: string;
  community: string;
  date: string;
  time_slot?: string;
  description?: string;
  status?: 'closed' | 'live';
}

export interface CommunityOption {
  id: string;
  name: string;
  color: string;
  initials: string;
}

interface GoogleCalendarViewProps {
  events: CalendarEvent[];
  communities: CommunityOption[];
  isManagerView?: boolean;
}

function parseTimeSlot(slot?: string): { startHour: number; endHour: number; displayTime: string } {
  if (!slot || !slot.includes('-')) {
    return { startHour: 10, endHour: 12, displayTime: slot || '10:00 AM - 12:00 PM' };
  }

  const parts = slot.split('-');
  const rawStart = parts[0].trim();
  const rawEnd = parts[1].trim();

  const parseHour = (str: string): number => {
    const isPM = str.toUpperCase().includes('PM');
    const isAM = str.toUpperCase().includes('AM');
    const cleanStr = str.replace(/(AM|PM)/gi, '').trim();
    const timeParts = cleanStr.split(':');
    let hour = parseInt(timeParts[0], 10);
    if (isNaN(hour)) return 9;
    if (isPM && hour < 12) hour += 12;
    if (isAM && hour === 12) hour = 0;
    return hour;
  };

  const startHour = parseHour(rawStart);
  let endHour = parseHour(rawEnd);
  if (endHour <= startHour) endHour = startHour + 1;

  return { startHour, endHour, displayTime: `${rawStart} - ${rawEnd}` };
}

export default function GoogleCalendarView({ events, communities, isManagerView = false }: GoogleCalendarViewProps) {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [activeModalEvent, setActiveModalEvent] = useState<CalendarEvent | null>(null);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const filteredEvents = events.filter((evt) => {
    if (selectedCommunity !== 'all') {
      return (evt.community || '').toLowerCase() === selectedCommunity.toLowerCase();
    }
    return true;
  });

  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() - 1);
    else if (viewMode === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === 'month') d.setMonth(d.getMonth() + 1);
    else if (viewMode === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const handleToday = () => setCurrentDate(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const startDay = getFirstDayOfMonth(currentYear, currentMonth);

  const getWeekDays = (refDate: Date) => {
    const startOfWeek = new Date(refDate);
    startOfWeek.setDate(refDate.getDate() - refDate.getDay());
    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const weekDays = getWeekDays(currentDate);
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM

  const isEventOnDate = (evt: CalendarEvent, dateObj: Date) => {
    if (!evt.date) return false;
    const evtDateStr = evt.date.split('T')[0];
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    const targetStr = `${y}-${m}-${d}`;
    return evtDateStr === targetStr;
  };

  return (
    <div className="brutalist-card rounded-2xl overflow-hidden flex flex-col font-sans">
      {/* Calendar Header & View Selector */}
      <div className="p-4 border-b border-[#1e2436] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#161a29]">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-lg bg-[#0f121d] border border-[#1e2436] text-xs font-semibold text-white hover:border-[#6366f1] transition-colors"
          >
            Today
          </button>
          <div className="flex items-center space-x-1">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#0f121d] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg text-[#94a3b8] hover:text-white hover:bg-[#0f121d] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <h2 className="text-lg font-bold text-white ml-2 font-display">
            {monthNames[currentMonth]} {currentYear}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Community Filter Dropdown */}
          <select
            value={selectedCommunity}
            onChange={(e) => setSelectedCommunity(e.target.value)}
            className="px-3 py-1.5 bg-[#0f121d] border border-[#1e2436] rounded-lg text-xs font-medium text-white focus:outline-none focus:border-[#6366f1]"
          >
            <option value="all">All Communities</option>
            {communities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* View Toggles */}
          <div className="flex items-center bg-[#0f121d] border border-[#1e2436] rounded-lg p-1">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 text-xs font-semibold capitalize rounded-md transition-all ${
                  viewMode === mode
                    ? 'bg-[#6366f1] text-white shadow-sm font-bold'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* View Engine */}
      {viewMode === 'month' && (
        <div className="flex-1 flex flex-col min-h-[600px]">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-[#1e2436] bg-[#0f121d] text-center text-xs font-bold text-[#94a3b8] py-2.5 uppercase tracking-wider">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Month Grid Cells */}
          <div className="grid grid-cols-7 flex-1 auto-rows-fr bg-[#08090d]">
            {Array.from({ length: startDay }).map((_, idx) => (
              <div key={`empty-${idx}`} className="border-r border-b border-[#1e2436]/60 bg-[#0f121d]/40 min-h-[110px]" />
            ))}

            {Array.from({ length: totalDays }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateObj = new Date(currentYear, currentMonth, dayNum);
              const dayEvents = filteredEvents.filter((evt) => isEventOnDate(evt, dateObj));
              const isToday =
                new Date().getDate() === dayNum &&
                new Date().getMonth() === currentMonth &&
                new Date().getFullYear() === currentYear;

              return (
                <div
                  key={`day-${dayNum}`}
                  className="border-r border-b border-[#1e2436] p-2 min-h-[110px] flex flex-col justify-start hover:bg-[#161a29]/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-[#6366f1] text-white' : 'text-[#94a3b8]'
                      }`}
                    >
                      {dayNum}
                    </span>
                  </div>

                  <div className="space-y-1 overflow-y-auto max-h-[90px] pr-0.5 scrollbar-hide">
                    {dayEvents.map((evt) => {
                      const { displayTime } = parseTimeSlot(evt.time_slot);
                      return (
                        <button
                          key={evt.id}
                          onClick={() => setActiveModalEvent(evt)}
                          className="w-full text-left px-2 py-1 rounded bg-[#161a29] hover:bg-[#1e2436] border border-[#1e2436] transition-colors block group"
                        >
                          <div className="text-[11px] font-bold text-white truncate leading-tight group-hover:text-[#6366f1] font-heading">
                            {evt.title}
                          </div>
                          <div className="text-[9px] text-[#94a3b8] truncate flex items-center justify-between mt-0.5">
                            <span>{evt.community}</span>
                            <span>{displayTime.split('-')[0].trim()}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week & Day Views (Google Calendar Time Blocks) */}
      {(viewMode === 'week' || viewMode === 'day') && (
        <div className="flex-1 flex flex-col min-h-[650px] bg-[#08090d]">
          {/* Header Row */}
          <div className={`grid ${viewMode === 'week' ? 'grid-cols-8' : 'grid-cols-2'} border-b border-[#1e2436] bg-[#0f121d] text-center text-xs font-bold text-[#94a3b8] py-2.5`}>
            <div className="w-16 text-center text-[#94a3b8] font-mono text-[11px]">Time</div>
            {(viewMode === 'week' ? weekDays : [currentDate]).map((d) => (
              <div key={d.toISOString()} className="flex flex-col items-center">
                <span>{daysOfWeek[d.getDay()]}</span>
                <span className={`text-xs font-bold mt-0.5 ${d.toDateString() === new Date().toDateString() ? 'text-[#6366f1]' : 'text-white'}`}>
                  {d.getDate()}
                </span>
              </div>
            ))}
          </div>

          {/* Time Slot Body */}
          <div className="flex-1 overflow-y-auto max-h-[600px] relative scrollbar-hide">
            {hours.map((hour) => (
              <div
                key={hour}
                className={`grid ${viewMode === 'week' ? 'grid-cols-8' : 'grid-cols-2'} border-b border-[#1e2436]/60 min-h-[60px]`}
              >
                <div className="w-16 border-r border-[#1e2436] text-[10px] text-[#94a3b8] font-mono p-2 text-right select-none">
                  {hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`}
                </div>

                {(viewMode === 'week' ? weekDays : [currentDate]).map((d) => {
                  const dayEvents = filteredEvents.filter((evt) => {
                    if (!isEventOnDate(evt, d)) return false;
                    const { startHour } = parseTimeSlot(evt.time_slot);
                    return startHour === hour;
                  });

                  return (
                    <div
                      key={d.toISOString()}
                      className="border-r border-[#1e2436]/40 p-1 relative min-h-[60px]"
                    >
                      {dayEvents.map((evt) => {
                        const { startHour, endHour, displayTime } = parseTimeSlot(evt.time_slot);
                        const durationHours = Math.max(1, endHour - startHour);
                        const blockHeightPx = durationHours * 60 - 6;

                        return (
                          <div
                            key={evt.id}
                            onClick={() => setActiveModalEvent(evt)}
                            style={{ height: `${blockHeightPx}px` }}
                            className="absolute left-1 right-1 top-1 z-10 p-2 rounded-lg bg-[#161a29] border border-[#6366f1]/50 hover:border-[#6366f1] cursor-pointer shadow-md flex flex-col justify-between transition-all overflow-hidden"
                          >
                            <div>
                              <span className="text-[9px] font-mono text-[#6366f1] block uppercase font-bold">
                                {evt.category}
                              </span>
                              <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5 font-heading">
                                {evt.title}
                              </h4>
                              <p className="text-[10px] text-[#94a3b8] line-clamp-1">
                                {evt.community}
                              </p>
                            </div>
                            <div className="text-[9px] text-[#94a3b8] font-mono flex items-center justify-between border-t border-[#1e2436] pt-1 mt-1">
                              <span>{displayTime}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Details Popover Modal */}
      {activeModalEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="brutalist-card p-6 max-w-md w-full space-y-4 rounded-xl relative text-white">
            <button
              onClick={() => setActiveModalEvent(null)}
              className="absolute top-4 right-4 text-[#94a3b8] hover:text-white p-1 rounded-lg hover:bg-[#161a29] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#6366f1] text-white border border-[#4f46e5]">
                {activeModalEvent.category}
              </span>
              <h3 className="text-xl font-bold text-white mt-2 font-display">{activeModalEvent.title}</h3>
              <p className="text-xs text-[#94a3b8]">{activeModalEvent.community}</p>
            </div>

            {activeModalEvent.description && (
              <p className="text-xs text-[#94a3b8] leading-relaxed border-t border-b border-[#1e2436] py-3 line-clamp-2">
                {generate2LineSummary(activeModalEvent.description)}
              </p>
            )}

            <div className="space-y-2 text-xs text-[#94a3b8]">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="w-4 h-4 text-[#6366f1]" />
                <span>{activeModalEvent.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#6366f1]" />
                <span>{parseTimeSlot(activeModalEvent.time_slot).displayTime}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Link
                href={`/events/${activeModalEvent.id}`}
                className="brutalist-btn-primary px-4 py-2 text-xs rounded-lg flex items-center space-x-1.5"
              >
                <span>View Full Page</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
