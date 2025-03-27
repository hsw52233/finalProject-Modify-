package com.example.academy.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.academy.dto.AddReservationDTO;
import com.example.academy.dto.ReservationEmployeeDTO;
import com.example.academy.dto.ReservationListDTO;
import com.example.academy.mapper.ReservationMapper;
import com.example.academy.vo.Common;
import com.example.academy.vo.Employee;

import lombok.extern.slf4j.Slf4j;


@Service
@Transactional
@Slf4j
public class ReservationService {
	@Autowired ReservationMapper reservationMapper;
	
	// 박시현 : 회의실 예약수정 시 가능한 종료시간만 출력 + 현재 수정 중인 예약 시간도 출력
	public List<Common> modifyReservationByEndTime(AddReservationDTO addReservationDTO) {
		return reservationMapper.updateReservationByEndTime(addReservationDTO);
	}
	
	// 박시현 : 회의실 예약수정 시 가능한 시작시간만 출력 + 현재 수정 중인 예약 시간도 출력
	public List<Common> modifyReservationByBeginTime(AddReservationDTO addReservationDTO) {
		return reservationMapper.updateReservationByBeginTime(addReservationDTO);
	}
	
	// 박시현 : 회의실 예약 시 가능한 종료 시간만 출력
	public List<Common> getReservationByEndTime(AddReservationDTO addReservationDTO) {
		return reservationMapper.selectReservationByEndTime(addReservationDTO);
	}
	
	// 박시현 : 회의실 예약 시 가능한 시작 시간만 출력
	public List<Common> getReservationByBeginTime(AddReservationDTO addReservationDTO) {
		return reservationMapper.selectReservationByBeginTime(addReservationDTO);
	}
	
	// 박시현 : 예약 취소
	public Integer removeReservation(Integer reservationNo) {
	    // 예약 삭제
	    Integer row = reservationMapper.deleteReservation(reservationNo);
	    
	    if(row > 0) {
	        // 예약 직원 삭제 (삭제된 직원 번호 반환)
	        reservationMapper.deleteReservationByEmployee(reservationNo);
	        
	    }
	    return row;
	}
	
	// 박시현 : 수정페이지 - 예약참여자 조회
	public List<ReservationEmployeeDTO> getReservationEmployee(Integer reservationNo) {
		return reservationMapper.selectReservationEmployees(reservationNo);
	}
	
	// 박시현 : 예약 수정
	public Integer modifyReservation(ReservationListDTO reservationListDTO, ReservationEmployeeDTO reservationEmployeeDTO) {
	    Integer row = reservationMapper.updateReservation(reservationListDTO);

	    // 예약 유저 삭제기능 (DTO에 컬럼변수 추가해야함)
	    String[] deleteEmployees = reservationListDTO.getDeleteEmployee();
	    if (deleteEmployees != null && deleteEmployees.length > 0) {
	        for (String employeeNo : deleteEmployees) {
	            if (employeeNo != null && !employeeNo.isEmpty()) {
	                Integer empNo = Integer.parseInt(employeeNo);
	                reservationMapper.deleteReservationEmployee(empNo, reservationListDTO.getReservationNo());
	                log.debug("삭제 employeeNo : " + empNo);
	            }
	        }
	    }
	    
	    if (row > 0) {
	        Integer reservationNo = reservationListDTO.getReservationNo(); // 생성된 예약 번호

	        // 예약 참여자 삽입(에러/ 이미 등록된 참여자는 추가가되지않고 삭제만 됨)
	        List<ReservationEmployeeDTO> employees = reservationListDTO.getReservationEmployees();
	        if (employees != null && !employees.isEmpty()) {
	            for (ReservationEmployeeDTO employee : employees) {
	                // employeeNo가 null이거나 0이면 추가하지 않음
	                if (employee.getEmployeeNo() == null || employee.getEmployeeNo() == 0) {
	                    System.out.println("employeeNo : " + employee.getEmployeeNo());
	                    continue; // 유효하지 않으면 건너뛰기
	                }

	                employee.setReservationNo(reservationNo);
	                reservationMapper.updateReservationEmployee(employee); 
	                log.debug("추가 employeeNo : " + employees);
	            }
	        }
	    }

	    return row;
	}
	
	// 박시현 : 예약번호별 상세정보
	public ReservationListDTO getReservationOne(Integer reservationNo) {
	    ReservationListDTO reservationOne = reservationMapper.selectReservationOne(reservationNo);
	    
	    // 예약 직원 정보 가져오기
	    List<ReservationEmployeeDTO> employees = reservationMapper.selectReservationEmployees(reservationOne.getReservationNo());
	    
	    // 직원 목록을 예약 객체에 설정
	    reservationOne.setReservationEmployees(employees);
	    
	    return reservationOne;
	}
	
	// 박시현 : 예약 신청 - 사원 검색
	public List<Employee> getReservationByEmployee(String searchEmployee, Integer reservationPerson) {
	    Map<String, Object> params = new HashMap<>();
	    params.put("searchEmployee", searchEmployee);
	    params.put("reservationPerson", reservationPerson);
	    return reservationMapper.selectReservationByEmployee(params);
	}
	
	// 박시현 : 예약 신청
	public Integer insertReservation(AddReservationDTO addReservationDTO) {
		
		// 예약 정보 삽입
		int row = reservationMapper.insertReservation(addReservationDTO);
		
		if (row > 0) {
	        Integer reservationNo = addReservationDTO.getReservationNo(); // 생성된 예약 번호
	        
	        // 예약 참여자 삽입
	        for (ReservationEmployeeDTO employee : addReservationDTO.getReservationEmployees()) {
	            // employeeNo가 null이거나 0보다 작거나 같으면 삽입하지 않음
	            if (employee.getEmployeeNo() != null && employee.getEmployeeNo() > 0) {
	                employee.setReservationNo(reservationNo);
	                reservationMapper.insertReservationByEmployee(employee);
	            } 
	            // employeeNo가 null이거나 0보다 작거나 같으면 삭제
	            else if (employee.getEmployeeNo() == null || employee.getEmployeeNo() <= 0) {
	                if (employee.getEmployeeNo() != null) {
	                    reservationMapper.deleteReservationEmployee(employee.getEmployeeNo(), employee.getReservationNo());
	                }
	                // 로그로 삽입되지 않은 이유를 확인
	                System.out.println("employeNo : " + employee.getEmployeeNo());
	            }
	        }
	    }
        return row;
	}
	
	// 박시현 : 회의실 목록 출력
	public List<ReservationListDTO> getReservationList() {
		List<ReservationListDTO> reservationList = reservationMapper.selectReservationList();
        
        // 회의 참여자 추가
        for (ReservationListDTO reservation : reservationList) {
            List<ReservationEmployeeDTO> employees = reservationMapper.selectReservationEmployees(reservation.getReservationNo());
            reservation.setReservationEmployees(employees);
        }
        
        return reservationList;
	}
}
