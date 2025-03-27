package com.example.academy.restcontroller;

import org.springframework.web.bind.annotation.RestController;

import com.example.academy.service.CalendarService;
import com.example.academy.vo.Calendar;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


@RestController
public class CalendarRestController {
	@Autowired CalendarService calendarService;
	
	// 진수우 : 캘랜더 리스트 출력.
	@GetMapping("/restapi/calendarList/{employeeNo}")
    public ResponseEntity<List<Calendar>> getEmployeeSchedule(@PathVariable("employeeNo") int employeeNo) {
        List<Calendar> calendar = calendarService.getCalendar(employeeNo);
        if (calendar != null) {
            return ResponseEntity.ok(calendar);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
