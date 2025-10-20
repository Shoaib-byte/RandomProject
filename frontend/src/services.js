import axios from 'axios'
const baseUrl = ''
const api_key = import.meta.env.VITE_SOME_KEY

const getAll = () => {
  const request = axios.get(`/persons`)
  return request.then(response => response.data)
}

const getByName =(name) => {
    const request = axios.get(`/api/persons/${name}`)
    return request.then(response => response.data)
}

const getWeatherData = (lat,lon) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`)
    return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(`${baseUrl}/api/persons`, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

const deleteObject = (id) => {
    return  axios.delete(`${baseUrl}/${id}`)
}

export default { 
    getAll,
    getByName,
    create, 
    update,
    deleteObject,
    getWeatherData
}