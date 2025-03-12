// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DoctorVerification {
    address public owner;
    
    struct Doctor {
        string name;
        string licenseNumber;
        string specialization;
        string institution;
        string graduationYear;
        uint256 verifiedDate;
        uint256 expiryDate;
        bool isActive;
    }
    
    // Mapping from license number to doctor info
    mapping(string => Doctor) private doctors;
    
    // Mapping to track if a license number is registered
    mapping(string => bool) private registeredLicenses;
    
    // List of admin addresses that can register/revoke licenses
    mapping(address => bool) private admins;
    
    // Events
    event DoctorRegistered(string licenseNumber, string name, uint256 timestamp);
    event LicenseRevoked(string licenseNumber, uint256 timestamp);
    event LicenseReactivated(string licenseNumber, uint256 timestamp);
    event AdminAdded(address admin, uint256 timestamp);
    event AdminRemoved(address admin, uint256 timestamp);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == owner, "Only admin can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        admins[msg.sender] = true; // Owner is also an admin
    }
    
    //  {
        owner = msg.sender;
        admins[msg.sender] = true; // Owner is also an admin
    }
    
    // Admin management functions
    function addAdmin(address _admin) external onlyOwner {
        require(_admin != address(0), "Invalid address");
        require(!admins[_admin], "Already an admin");
        
        admins[_admin] = true;
        emit AdminAdded(_admin, block.timestamp);
    }
    
    function removeAdmin(address _admin) external onlyOwner {
        require(_admin != owner, "Cannot remove owner as admin");
        require(admins[_admin], "Not an admin");
        
        admins[_admin] = false;
        emit AdminRemoved(_admin, block.timestamp);
    }
    
    // Doctor registration function
    function registerDoctor(
        string memory _licenseNumber,
        string memory _name,
        string memory _specialization,
        string memory _institution,
        string memory _graduationYear,
        uint256 _expiryDate
    ) external onlyAdmin {
        require(!registeredLicenses[_licenseNumber], "License already registered");
        require(bytes(_licenseNumber).length > 0, "License number cannot be empty");
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_expiryDate > block.timestamp, "Expiry date must be in the future");
        
        Doctor memory newDoctor = Doctor({
            name: _name,
            licenseNumber: _licenseNumber,
            specialization: _specialization,
            institution: _institution,
            graduationYear: _graduationYear,
            verifiedDate: block.timestamp,
            expiryDate: _expiryDate,
            isActive: true
        });
        
        doctors[_licenseNumber] = newDoctor;
        registeredLicenses[_licenseNumber] = true;
        
        emit DoctorRegistered(_licenseNumber, _name, block.timestamp);
    }
    
    // Get doctor information
    function getDoctorInfo(string memory _licenseNumber) external view returns (Doctor memory) {
        require(registeredLicenses[_licenseNumber], "License not registered");
        return doctors[_licenseNumber];
    }
    
    // Check if a doctor's license is valid
    function isLicenseValid(string memory _licenseNumber) external view returns (bool) {
        if (!registeredLicenses[_licenseNumber]) {
            return false;
        }
        
        Doctor memory doctor = doctors[_licenseNumber];
        return doctor.isActive && block.timestamp <= doctor.expiryDate;
    }
    
    // Revoke a doctor's license
    function revokeLicense(string memory _licenseNumber) external onlyAdmin {
        require(registeredLicenses[_licenseNumber], "License not registered");
        require(doctors[_licenseNumber].isActive, "License already revoked");
        
        doctors[_licenseNumber].isActive = false;
        emit LicenseRevoked(_licenseNumber, block.timestamp);
    }
    
    // Reactivate a doctor's license
    function reactivateLicense(string memory _licenseNumber) external onlyAdmin {
        require(registeredLicenses[_licenseNumber], "License not registered");
        require(!doctors[_licenseNumber].isActive, "License already active");
        require(block.timestamp <= doctors[_licenseNumber].expiryDate, "License has expired");
        
        doctors[_licenseNumber].isActive = true;
        emit LicenseReactivated(_licenseNumber, block.timestamp);
    }
    
    // Update a doctor's expiry date
    function updateExpiryDate(string memory _licenseNumber, uint256 _newExpiryDate) external onlyAdmin {
        require(registeredLicenses[_licenseNumber], "License not registered");
        require(_newExpiryDate > block.timestamp, "New expiry date must be in the future");
        
        doctors[_licenseNumber].expiryDate = _newExpiryDate;
    }
}

