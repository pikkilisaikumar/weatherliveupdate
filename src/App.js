import {Component} from 'react'

import {Loader} from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './App.css'

const apiStatusChange = {
  intial: 'INTIAL',
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  state = {
    search: '',
    uday: [],
    apiStatus: apiStatusChange.intial,
  }

  componentDidMount() {
    this.getDetails()
  }

  searchCity = event => {
    this.setState({search: event.target.value})
  }

  press = event => {
    const {search} = this.state
    if (event.key === 'Enter') {
      const getdata = localStorage.getItem('name')
      if (getdata === null) {
        localStorage.setItem('name', search)
        this.setState({search}, this.getDetails)
      } else {
        localStorage.removeItem('name')
        localStorage.setItem('name', search)
        this.setState({search}, this.getDetails)
      }
    }
  }

  getDetails = async () => {
    this.setState({apiStatus: apiStatusChange.loading})
    const namedata = localStorage.getItem('name')
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${namedata}&appid=c3e89bc97eb6bd54a4b2b7ea34b98c35`
    const response = await fetch(url)
    console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const ram = {
        temp: data.main.temp,
        minTemp: data.main.temp_min,
        maxTemp: data.main.temp_max,
        weather: data.weather[0].main,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        name: data.name,
      }
      this.setState({
        uday: ram,
        search: '',
        apiStatus: apiStatusChange.success,
      })
    } else if (response.status === 404) {
      this.setState({search: '', apiStatus: apiStatusChange.failure})
    }
  }

  renderSuccess = () => {
    const {uday, search} = this.state
    console.log(uday)
    const {temp, minTemp, maxTemp, weather, humidity, pressure, name} = uday
    return (
      <div className="background">
        <div className="background1">
          <input
            type="text"
            value={search}
            className="input"
            onChange={this.searchCity}
            onKeyPress={this.press}
            placeholder="Enter the city name"
          />
          <div className="uday">
            <h1>{name}</h1>
          </div>
          <h1>{temp} F</h1>
          <h2>{weather}</h2>
          <p>Coldest Temperature: {minTemp} F </p>
          <p>Warmest Temperature: {maxTemp} F </p>
          <div className="uday">
            <p>Humidity :{humidity} </p>
            <p>Pressure :{pressure} </p>
          </div>
        </div>
      </div>
    )
  }

  renderFailure = () => {
    const {search} = this.state
    return (
      <div className="background">
        <div className="background1">
          <input
            type="text"
            value={search}
            className="input"
            onChange={this.searchCity}
            onKeyPress={this.press}
            placeholder="Enter the city name"
          />
          <h1>Country is not Found</h1>
        </div>
      </div>
    )
  }

  renderLoading = () => (
    <div className="background">
      <div className="background1">
        <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
      </div>
    </div>
  )

  render() {
    const {apiStatus} = this.state
    console.log(apiStatus)
    switch (apiStatus) {
      case apiStatusChange.success:
        return this.renderSuccess()
      case apiStatusChange.failure:
        return this.renderFailure()
      case apiStatusChange.loading:
        return this.renderLoading()
      default:
        return null
    }
  }
}

export default App
