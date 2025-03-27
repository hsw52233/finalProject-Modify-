package com.example.academy.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.ByWeekday;
import com.example.academy.dto.CalendarAttendanceListDTO;
import com.example.academy.dto.CalendarLectureListDTO;
import com.example.academy.dto.CalendarReservationListDTO;
import com.example.academy.dto.Rrule;
import com.example.academy.mapper.CalendarMapper;
import com.example.academy.vo.Calendar;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class CalendarService {
	@Autowired CalendarMapper calendarMapper;
	
	// 진수우 : 마이페이지에서 캘랜더 리스트 출력.
	public List<Calendar> getCalendar(Integer employeeNo) {
		// 모든 스케줄을 담을 리스트.
		List<Calendar> scheduleList = new ArrayList<>();
		
		// 회의실예약 스케줄 조회.
		List<CalendarReservationListDTO> reservationList = calendarMapper.selectReservationList(employeeNo);
		
		// 회의실예약정보를 캘린더객체에 set.
		for (CalendarReservationListDTO reservation : reservationList) {
			Calendar calendar = new Calendar();
			calendar.setCalendarTitle(reservation.getReservationTitle()); // 타이틀.
			calendar.setCalendarDescription(reservation.getReservationContent()); // 상세정보.
			calendar.setCalendarDate(reservation.getReservationDate());
			calendar.setCalendarStart(reservation.getBeginTimeName()); // 시작시간.
			calendar.setCalendarEnd(reservation.getEndTimeName()); // 종료시간.
			calendar.setCalendarClassName("primary"); // 카테고리.
			scheduleList.add(calendar); // 리스트에 추가.
		}
		
		// 강의 스케줄 조회.
		List<CalendarLectureListDTO> lectureList = calendarMapper.selectLectureList(employeeNo);
		
		// 강의스케줄정보를 캘린더객체에 set.
		for (CalendarLectureListDTO lecture : lectureList) {
			Calendar calendar = new Calendar();
			calendar.setCalendarTitle(lecture.getLectureName()); // 타이틀.
			calendar.setCalendarDescription(lecture.getLectureContent()); // 상세정보.
			calendar.setCalendarClassName("success"); // 카테고리.
			
			// 요일, 시간정보를 byweekday 객체에 set.
			if (lecture.getBeginTimeCode() != null || lecture.getEndTimeCode() != null || lecture.getWeekdayCode() != null) {
				String[] beginTime = lecture.getBeginTimeCode().split(",");
				String[] endTime = lecture.getEndTimeCode().split(",");
				String[] weekday = lecture.getWeekdayCode().split(",");
				List<ByWeekday> byWeekdayList = new ArrayList<>();
				for(int i = 0; i < weekday.length; i++) {
					ByWeekday byWeekday = new ByWeekday();
					byWeekday.setStartTime(beginTime[i]);
					byWeekday.setEndTime(endTime[i]);
					byWeekday.setDay(weekday[i]);
					byWeekdayList.add(byWeekday);
				}
				
				// 요일/시간정보, 시작날짜, 종료날짜를 rrule 객체 set.
				Rrule rrule = new Rrule();
				rrule.setByweekday(byWeekdayList); // 요일,시간정보.
				rrule.setDtstart(lecture.getLectureBeginDate()); // 시작날짜.
				rrule.setUntil(lecture.getLectureEndDate()); // 종료날짜.
				calendar.setRrule(rrule);
				scheduleList.add(calendar); // 리스트에 추가.
			}
		}
		
		// 근무 스케줄 조회.
		List<CalendarAttendanceListDTO> attendanceList = calendarMapper.selectAttendanceList(employeeNo);
		
		// 근무스케줄정보를 캘린더객체에 set.
		for(CalendarAttendanceListDTO attendance : attendanceList) {
			Calendar calendar = new Calendar();
			calendar.setCalendarTitle(attendance.getAttendanceApprovalTypeName()); // 근태종류.
			calendar.setCalendarBeginDate(attendance.getAttendanceApprovalBegindate()); // 시작날짜.
			calendar.setCalendarEndDate(attendance.getAttendanceApprovalEnddate()); // 종료날짜.
			calendar.setCalendarClassName("danger"); // 카테고리.
			scheduleList.add(calendar); // 리스트에 추가.
		}
		
		log.debug("스케쥴 : " + scheduleList);
		return scheduleList;
	}
}
