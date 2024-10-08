import React, { useState } from "react";
import styled from "styled-components";

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  position: relative;
  background: #282c34;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  width: 600px;
  max-width: 90%;
`;

const CloseButton = styled.span`
  font-size: 24px;
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  color: white;

  &:hover {
    color: #b83c8f;
  }
`;

const H2 = styled.h2`
  color: #da4ea2;         /* Match the theme color */
  text-align: center;      /* Center the heading */
  margin-bottom: 30px;     /* Add some spacing below the heading */
  font-size: 24px;         /* Optional: Control font size */
  font-weight: bold;       /* Optional: Make the heading bold */
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;  // For mobile, stack fields vertically
    gap: 0;
  }
`;

const Input = styled.input`
  padding: 12px;
  width: 100%;
  border: 1px solid #da4ea2;
  border-radius: 5px;
  background: #3d1c56;
  color: #fff;

  &:focus {
    outline: none;
    border-color: #da4ea2;
  }
`;

const Select = styled.select`
  padding: 12px;
  width: 100%;
  border: 1px solid #da4ea2;
  border-radius: 5px;
  background: #3d1c56;
  color: white;

  &:focus {
    outline: none;
    border-color: #da4ea2;
  }
`;

const Button = styled.button`
  background-color: #da4ea2;
  color: white;
  font-weight: 500;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #b83c8f;
  }
`;

const ToggleLink = styled.p`
  color: lightgray;
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
`;

const SignUpForm = ({ onSwitchToLogin, onClose }) => {
  const [role, setRole] = useState("student");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [school, setSchool] = useState("");
  const [board, setBoard] = useState("");
  const [mobile, setMobile] = useState("");
  const [stream, setStream] = useState("");
  const [classStandard, setClassStandard] = useState("");

  const [subject, setSubject] = useState("");
  const [gradeLevels, setGradeLevels] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        username,
        password,
        name,
        email,
        age,
        mobile,
        role
      };

      if (role === "student") {
        userData.classStandard = classStandard;
        userData.school = school;
        userData.board = board;
        userData.stream = stream;
      } else if (role === "teacher") {
        userData.subject = subject;
        userData.grade_levels = gradeLevels;
      }

      console.log('Submitting user data:', userData);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("User registered successfully:", data);
        onSwitchToLogin(); // Go to login after successful registration
      } else {
        console.error("Error during registration:", data);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClickOutside = (e) => {
    if (e.target.id === "modal") {
      onClose(); // Close modal
    }
  };

  return (
    <Modal id="modal" onClick={handleClickOutside}>
      <FormContainer>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <H2>Sign Up</H2>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <Select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </Select>

            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormRow>

          <FormRow>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </FormRow>

          <FormRow>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </FormRow>

          {/* Conditional Fields for Students */}
          {role === "student" && (
            <>
              <FormRow>
                <Select value={classStandard} onChange={(e) => setClassStandard(e.target.value)} required>
                  <option value="" disabled>Select Class/Standard</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={`Class ${i + 1}`}>{`Class ${i + 1}`}</option>
                  ))}
                </Select>
                
                <Input
                  type="text"
                  placeholder="School"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  required
                />
              </FormRow>

              <FormRow>
                <Select value={board} onChange={(e) => setBoard(e.target.value)} required>
                  <option value="" disabled>Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="State Board">State Board</option>
                </Select>

                <Select value={stream} onChange={(e) => setStream(e.target.value)} required>
                  <option value="" disabled>Select Stream</option>
                  <option value="general">General</option>
                  <option value="PCM">PCM</option>
                  <option value="PCMB">PCMB</option>
                  <option value="PCB">PCB</option>
                  <option value="Commerce with Maths">Commerce with Maths</option>
                  <option value="Commerce without Maths">Commerce without Maths</option>
                  <option value="Humanities">Humanities</option>
                </Select>
              </FormRow>
            </>
          )}

          {/* Conditional Fields for Teachers */}
          {role === "teacher" && (
            <>
              <FormRow>
                <Input
                  type="text"
                  placeholder="Subject Specialization"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />

                <Input
                  type="text"
                  placeholder="Grade Levels Handled"
                  value={gradeLevels}
                  onChange={(e) => setGradeLevels(e.target.value)}
                  required
                />
              </FormRow>
            </>
          )}

          <Input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
          />

          <Button type="submit">Sign Up</Button>
        </form>
        <ToggleLink onClick={onSwitchToLogin}>Already have an account? Login</ToggleLink>
      </FormContainer>
    </Modal>
  );
};

export default SignUpForm;