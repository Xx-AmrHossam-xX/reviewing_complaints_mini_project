import axios from 'axios';
const Axios = axios.create({
	baseURL: 'https://staging.mymelior.com/v1/'
});

// Alter defaults after instance has been created
Axios.defaults.headers.common['Authorization'] = 'Bearer SLSmxK17vjRInEWIiFQjwE1QIDfeSM';

export default Axios;
