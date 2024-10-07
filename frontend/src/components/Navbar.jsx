import React, { useState } from "react";
import styled from "styled-components";
import axios from 'axios';

const Section = styled.div`
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`;

const Container = styled.div`
  width: 1400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;

  @media only screen and (max-width: 768px) {
    width: 100%;
    padding: 10px;
  }
`;

const Links = styled.div`
  display: flex;
  align-items: center;
  gap: 50px;
`;

const H2 = styled.h2`
  font-size: 36px;
`;

const List = styled.ul`
  display: flex;
  gap: 20px;
  list-style: none;

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

const ListItem = styled.li`
  cursor: pointer;
`;

const Icons = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const Icon = styled.img`
  width: 20px;
  cursor: pointer;
`;

const Button = styled.button`
  width: 150px;
  padding: 10px;
  background-color: #da4ea2;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const Navbar = () => {
  const [number, setNumber] = useState('');

  const sendMsg = () => {
    console.log("Number is", number);

    const body = {
      "messaging_product": "whatsapp",
      "to": "918586842783",
      "type": "template",
      "template": {
        "name": "hello_world",
        "language": {
          "code": "en_US"
        }
      }
    };

    axios.post(
      'https://graph.facebook.com/v20.0/467155953139597/messages',
      body,
      {
        headers: {
          Authorization: `Bearer EAAHSx0xfTOgBOw6dan0ZBXBz67864vMJeBTE0hZCrBlBMUrvT8D8jBldZAHJfDkdCZAKi1RqhKEhrkl80AS1f2sdmVoh29z1OdPa01092K880UGy0VslE4SG1rQQSOdzLopeyTbqHenZCksOEydmRyJ6JwqWvy2yWgbJnDYVsNurDBiQJ3NuMIfXb3wNm3xBQmvrOrap06TSbETUrILG3OVyB5B7ty9FzQvcZD`,
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      }
    )
    .then((res) => {
      console.log("Msg Send Success", res);
    })
    .catch((err) => {
      console.error("Error while sending", err.response ? err.response.data : err.message);
    });
  };

  return (
    <Section>
      <Container>
        <Links>
          <H2>AssessCurve</H2>
          <List>
            <ListItem>Home</ListItem>
            <ListItem>CurveAi</ListItem>
            <ListItem>Products</ListItem>
            <ListItem>Contact</ListItem>
          </List>
        </Links>
        <Icons>
          <Icon src="./img/search.png" />
          <Button onClick={sendMsg}>Send WhatsApp Msg</Button>
        </Icons>
      </Container>
    </Section>
  );
};

export default Navbar;