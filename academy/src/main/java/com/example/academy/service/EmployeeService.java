package com.example.academy.service;

import java.util.List;
import java.io.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.academy.dto.AffiliationModifyDTO;
import com.example.academy.dto.EmployeeAddDTO;
import com.example.academy.dto.EmployeeListDTO;
import com.example.academy.dto.EmployeeModifyDTO;
import com.example.academy.dto.EmployeeModifyGetDTO;
import com.example.academy.dto.EmployeeOneDTO;
import com.example.academy.mapper.AddressMapper;
import com.example.academy.mapper.CommonMapper;
import com.example.academy.mapper.EmployeeMapper;
import com.example.academy.mapper.FilesMapper;
import com.example.academy.mapper.MemoMapper;
import com.example.academy.util.InputFile;
import com.example.academy.vo.Address;
import com.example.academy.vo.Files;

import lombok.extern.slf4j.Slf4j;

@Service
@Transactional
@Slf4j
public class EmployeeService {
	@Autowired private BCryptPasswordEncoder bCryptPasswordEncoder;
	@Autowired EmployeeMapper employeeMapper;
	@Autowired AddressMapper addressMapper;
	@Autowired FilesMapper filesMapper;
	@Autowired CommonMapper commonMapper;
	@Autowired MemoMapper memoMapper;
	
	// 진수우 : 사원삭제.
	public void removeEmployee(Integer employeeNo) {
		// 데이터베이스에서 사원메모 삭제.
		memoMapper.deleteMemo(employeeNo);
		
		// 파일정보가 수정되기 전에 기존 파일정보를 불러옴.
		EmployeeModifyGetDTO employeeModifyGetDTO = filesMapper.selectEmployeeModifyFile(employeeNo);
		
		// 데이터베이스에서 사원 프로필사진파일 삭제.
		filesMapper.deletePhotoFile(employeeNo);
		
		// 사원 프로필사진 물리적 파일 삭제.
		String photoFullname = "/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + employeeModifyGetDTO.getPhotoFileName() + "." + employeeModifyGetDTO.getPhotoFileExt();
		File photoFile = new File(photoFullname);
		photoFile.delete();
		
		// 데이터베이스에서 사원 도장사진파일 삭제.
		filesMapper.deleteStampFile(employeeNo);
		
		// 사원 도장사진 물리적 파일 삭제.
		String stampFullname = "/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + employeeModifyGetDTO.getStampFileName() + "." + employeeModifyGetDTO.getStampFileExt();
		File stampFile = new File(stampFullname);
		stampFile.delete();
		
		// 데이터베이스에서 불필요한 사원정보 수정.
		employeeMapper.deleteEmployee(employeeNo);
	}
	
	// 진수우 : 개인정보수정.
	public void modifyEmployee(EmployeeModifyDTO employeeModifyDTO) {
		int result = 0;
		// 데이터베이스에 사원정보 수정.
		result += employeeMapper.updateEmployee(employeeModifyDTO);
		// 데이터베이스에 주소정보 수정.
		result += addressMapper.updateAddress(employeeModifyDTO);
		// 파일정보가 수정되기 전에 기존 파일정보를 불러옴.
		EmployeeModifyGetDTO employeeModifyGetDTO = filesMapper.selectEmployeeModifyFile(employeeModifyDTO.getEmployeeNo());
		// 프로필사진 파일이 입력되었다면,
		if (employeeModifyDTO.getEmployeePhoto() != null && !employeeModifyDTO.getEmployeePhoto().isEmpty()) {
			// 데이터베이스에 프로필사진 파일정보 수정.
			MultipartFile photoMf = employeeModifyDTO.getEmployeePhoto(); // 폼에 입력되었던 프로필사진 파일데이터 가져옴.
			InputFile photoInputFile = new InputFile();
			photoInputFile.setOriginFileName(photoMf.getOriginalFilename()); // 파일의 실제이름을 추출해서 inputFile 인스턴스에 set.
			Files photofile = new Files();
			photofile.setFileNo(employeeModifyDTO.getPhotoFileNo());
			photofile.setFileName(photoInputFile.getUUID());
			photofile.setFileOrigin(photoInputFile.getFileName());
			photofile.setFileExt(photoInputFile.getFileExt());
			photofile.setFileSize(photoMf.getSize());
			photofile.setFileType(photoMf.getContentType());
			photofile.setFileCategory("FC001");
			result += filesMapper.updateFile(photofile);
			// 프로필사진 파일정보 수정이 완료되었다면,
			if (result == 3) {
				// 서버에 기존 물리적 파일삭제.
				String fullname = "/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + employeeModifyGetDTO.getPhotoFileName() + "." + employeeModifyGetDTO.getPhotoFileExt();
				File f = new File(fullname);
				f.delete();
				
				// 서버에 새로운 물리적 파일추가.
				try {
					photoMf.transferTo(new File("/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + photofile.getFileName() + "." + photofile.getFileExt()));
				} catch (Exception e) {
					e.printStackTrace();
					throw new RuntimeException();
				}
			}
		} else {
			result++;
		}
		// 도장사진 파일이 입력되었다면,
		if (employeeModifyDTO.getStampPhoto() != null && !employeeModifyDTO.getStampPhoto().isEmpty()) {
			// 데이터베이스에 도장사진 파일정보 수정.
			MultipartFile stampMf = employeeModifyDTO.getStampPhoto(); // 폼에 입력되었던 도장사진 파일데이터 가져옴.
			InputFile stampInputFile = new InputFile();
			stampInputFile.setOriginFileName(stampMf.getOriginalFilename()); // 파일의 실제이름을 추출해서 inputFile 인스턴스에 set.
			Files stampfile = new Files();
			stampfile.setFileName(stampInputFile.getUUID());
			stampfile.setFileOrigin(stampInputFile.getFileName());
			stampfile.setFileExt(stampInputFile.getFileExt());
			stampfile.setFileSize(stampMf.getSize());
			stampfile.setFileType(stampMf.getContentType());
			stampfile.setFileCategory("FC001");
			
			// 등록한 도장 파일이 없다면, 도장파일정보 생성.
			
			if (employeeModifyGetDTO.getStampFileName() == null) {
				result += filesMapper.insertFile(stampfile); // 도장파일정보 삽입.
				EmployeeModifyDTO employeeModifyDTOFileNo = new EmployeeModifyDTO(); 
				employeeModifyDTOFileNo.setStampFileNo(stampfile.getFileNo());
				employeeModifyDTOFileNo.setEmployeeNo(employeeModifyDTO.getEmployeeNo());
				result += employeeMapper.updateStampFileNo(employeeModifyDTOFileNo);
			} else { // 등록한 도장 파일이 있다면, 도장파일정보 수정.
				stampfile.setFileNo(employeeModifyDTO.getStampFileNo());
				result += filesMapper.updateFile(stampfile);
				result++;
			}
			// 도장사진 파일정보 생성/수정이 완료되었다면,
			if (result == 5) {
				// 등록한 도장 파일이 있다면,
				if (employeeModifyGetDTO.getStampFileName() != null) {
					// 서버에 기존 물리적 파일삭제.
					String fullname = "/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + employeeModifyGetDTO.getStampFileName() + "." + employeeModifyGetDTO.getStampFileExt();
					File f = new File(fullname);
					f.delete();
				}
				// 서버에 새로운 물리적 파일추가.
				try {
					stampMf.transferTo(new File("/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + stampfile.getFileName() + "." + stampfile.getFileExt()));
				} catch (Exception e) {
					e.printStackTrace();
					throw new RuntimeException();
				}
			}
		}
	}
	
	// 진수우 : 개인정보수정 사원정보조회
	public EmployeeModifyGetDTO getEmployeeModify(Integer employeeNo) {
		return employeeMapper.selectEmployeeModify(employeeNo);
	}
	
	// 진수우 : 사원부서/직책수정.
	public Integer modifyAffiliation(AffiliationModifyDTO affiliationModifyDTO) {
		if (affiliationModifyDTO.getEmployeeDepartment().equals("DP001")) affiliationModifyDTO.setEmployeeRole("humanresources"); // 부서마다 홈페이지 접근권한 설정.
		else if (affiliationModifyDTO.getEmployeeDepartment().equals("DP003")) affiliationModifyDTO.setEmployeeRole("Administration");
		else if (affiliationModifyDTO.getEmployeeDepartment().equals("DP002")) affiliationModifyDTO.setEmployeeRole("management");
		return employeeMapper.updateAffiliation(affiliationModifyDTO);
	}
		
	// 진수우 : 사원상세조회.
	public EmployeeOneDTO getEmployeeOne(Integer employeeNo) {
		EmployeeOneDTO result = employeeMapper.selectEmployeeOne(employeeNo);
		// 공통 테이블의 코드를 이름으로 변경.
		if (result.getEmployeeDepartment().equals("DP001")) result.setEmployeeDepartment("인사팀");
		if (result.getEmployeeDepartment().equals("DP002")) result.setEmployeeDepartment("운영팀");
		if (result.getEmployeeDepartment().equals("DP003")) result.setEmployeeDepartment("행정팀");
		if (result.getEmployeePosition().equals("PS001")) result.setEmployeePosition("팀장");
		if (result.getEmployeePosition().equals("PS002")) result.setEmployeePosition("사원");
		return result;
	}
	
	// 진수우 : 사원 추가.
	public void addEmployee(EmployeeAddDTO employeeAddDTO) {
		int result = 0;
		
		// 파일정보 데이터베이스에 삽입.
		MultipartFile mf = employeeAddDTO.getEmployeePhoto(); // 폼에 입력되었던 파일데이터 가져옴.
		InputFile inputFile = new InputFile(); // inputFile 인스턴스 생성.
		inputFile.setOriginFileName(mf.getOriginalFilename()); // 파일의 실제이름을 추출해서 inputFile 인스턴스에 set.
		Files files = new Files();
		files.setFileName(inputFile.getUUID()); // 서버에서 관리되는 파일이름.
		files.setFileOrigin(inputFile.getFileName()); // 실제 파일이름.
		files.setFileExt(inputFile.getFileExt()); // 파일 확장자.
		files.setFileSize(mf.getSize()); // 파일 크기.
		files.setFileType(mf.getContentType()); // 파일 타입.
		files.setFileCategory("FC001"); // 파일 카테고리.
		result += filesMapper.insertFile(files); // 파일정보 삽입.
		
		// 주소정보 데이터베이스에 삽입.
		Address address = new Address();
		address.setAddressName(employeeAddDTO.getAddressName());
		address.setAddressDetail(employeeAddDTO.getAddressDetail());
		address.setPostCode(employeeAddDTO.getPostCode());
		result += addressMapper.insertAddress(address);
		
		// 사원정보 데이터베이스에 삽입.
		Integer fileNo = files.getFileNo(); // 데이터베이스에 파일정보 삽입 시 자동으로 생성되는 fileNo값 가져옴.
		Integer addressNo = address.getAddressNo(); // 데이터베이스에 주소정보 삽입 시 자동으로 생성되는 addressNo값 가져옴.
		employeeAddDTO.setPhotoFileNo(fileNo);
		employeeAddDTO.setAddressNo(addressNo);
		employeeAddDTO.setEmployeePw(bCryptPasswordEncoder.encode("1234")); // 사원추가 시 임시비밀번호를 '1234'로 설정.
		if (employeeAddDTO.getEmployeeDepartment().equals("DP001")) employeeAddDTO.setEmployeeRole("humanresources"); // 부서마다 홈페이지 접근권한 설정.
		else if (employeeAddDTO.getEmployeeDepartment().equals("DP003")) employeeAddDTO.setEmployeeRole("Administration");
		else if (employeeAddDTO.getEmployeeDepartment().equals("DP002")) employeeAddDTO.setEmployeeRole("management");
		result += employeeMapper.insertEmployee(employeeAddDTO);
		
		// 서버에 물리적 파일 저장.
		if (result == 3) {
			try {
				mf.transferTo(new File("/home/ubuntu/apache-tomcat-10.1.34/webapps/upload/" + files.getFileName() + "." + files.getFileExt()));
			} catch (Exception e) {
				e.printStackTrace();
				throw new RuntimeException();
			}
		}
	}
	
	// 진수우 : 사원 리스트 출력.
	public List<EmployeeListDTO> getEmployeeList() {
	    List<EmployeeListDTO> result = employeeMapper.selectEmployeeList();
	    
	    for (EmployeeListDTO employeeListDTO : result) {
	        // employeeDepartment가 null이 아닌지 확인하고 처리
	        if (employeeListDTO.getEmployeeDepartment() != null) {
	            if (employeeListDTO.getEmployeeDepartment().equals("DP001")) employeeListDTO.setEmployeeDepartment("인사팀");
	            if (employeeListDTO.getEmployeeDepartment().equals("DP002")) employeeListDTO.setEmployeeDepartment("운영팀");
	            if (employeeListDTO.getEmployeeDepartment().equals("DP003")) employeeListDTO.setEmployeeDepartment("행정팀");
	        }
	    }

	    for (EmployeeListDTO employeeListDTO : result) {
	        // employeePosition이 null이 아닌지 확인하고 처리
	        if (employeeListDTO.getEmployeePosition() != null) {
	            if (employeeListDTO.getEmployeePosition().equals("PS001")) employeeListDTO.setEmployeePosition("팀장");
	            if (employeeListDTO.getEmployeePosition().equals("PS002")) employeeListDTO.setEmployeePosition("사원");
	        }
	    }
	    
	    return result;
	}
	
	// 진수우 : 사원 인원수 조회.
	public Integer countEmployee() {
		return employeeMapper.countEmployee();
	}
}
