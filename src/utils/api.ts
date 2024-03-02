import Axios from "axios";
const devUrl = "http://localhost:8080";
const proUrl = "";

const signUp = newUser => {
 const res = Axios.post(`${devUrl}/signup`, { newUser });
 return res;
};
