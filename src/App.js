import {Component} from 'react'

import {Loader} from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import './App.css'

const apiStatusChange = {
  intial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class App extends Component {
  state = {
    search: 'Delhi',
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
    if (event.key === 'Enter') {
      const {search} = this.state
      this.setState({search}, this.getDetails)
    }
  }

  getDetails = async () => {
    const {search} = this.state

    this.setState({
      apiStatus: apiStatusChange.loading,
    })

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${search}&appid=c3e89bc97eb6bd54a4b2b7ea34b98c35 `
    const response = await fetch(url)
    if (response.ok === true) {
      const data = await response.json()
      const ram = {
        temp: data.main.temp,
        minTemp: data.main.temp_min,
        maxTemp: data.main.temp_max,
        weather: data.weather[0].main,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        name: data.name,
      }
      this.setState({uday: ram, search: '', apiStatus: apiStatusChange.success})
    } else if (response.status === 404) {
      this.setState({search: '', apiStatus: apiStatusChange.failure})
    }
  }

  renderSuccess = () => {
    const {uday, search} = this.state
    const {temp, minTemp, maxTemp, weather, humidity, pressure, name} = uday
    return (
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
    )
  }

  renderFailure = () => {
    const {search} = this.state
    return (
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
    )
  }

  renderLoading = () => (
    <div className="background1" data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    let data

    switch (apiStatus) {
      case apiStatusChange.success:
        data = this.renderSuccess()
        break
      case apiStatusChange.failure:
        data = this.renderFailure()
        break
      case apiStatusChange.loading:
        data = this.renderLoading()
        break
      default:
        data = null
    }

    return <div className="background">{data}</div>
  }
}

export default App
