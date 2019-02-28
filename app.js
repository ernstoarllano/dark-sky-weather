class Weather {
  constructor(lat, lng) {
    // Set DOM elements to push data to
    this.tempContainer = document.querySelector('.weather__temp')
    this.summaryContainer = document.querySelector('.weather__summary')

    // Set necessary API 
    this.proxy = 'https://cors-anywhere.herokuapp.com/'
    this.apiKey = '49e354a2302b80f81d1f21ed446de1f8'
    this.lat = lat
    this.lng = lng

    // Set current date
    this.now = new Date()

    // Initialize whether to make fresh API call or use session storage data
    this.showData()
  }

  /**
   * Set the API request 
   * 
   * @return {string} API request to make
   */
  setAPIRequest() {
    return `${this.proxy}https://api.darksky.net/forecast/${this.apiKey}/${this.lat},${this.lng}`
  }

  /**
   * Fetch API request
   * 
   * @return {object} API request object
   */
  getAPIRequest() {
    fetch(this.setAPIRequest())
      .then(res => res.json())
      .then(data => this.setData(data))
      .catch(error => console.error(error))
  }

  /**
   * Store API request into session storage
   * 
   * @param {object} res - The API response 
   */
  setData(res) {
    if (!res) return

    const { icon, summary, temperature, time } = res.currently

    sessionStorage.setItem('weatherSet', 'true')
    sessionStorage.setItem('weatherIcon', icon)
    sessionStorage.setItem('weatherSummary', summary)
    sessionStorage.setItem('weatherTemp', temperature)
    sessionStorage.setItem('weatherTime', time)

    this.setHTML()
  }

  /**
   * Determine whether to make fresh API call or use session storage data
   */
  showData() {
    if (sessionStorage.getItem('weatherSet') !== 'true') {
      this.getAPIRequest()
    } else {
      this.setHTML()
    }
  }

  updateData(timeDiff) {
    if (!timeDiff && timeDiff < 6) return

    sessionStorage.clear()
    this.getAPIRequest()
  }

  /**
   * Set API data in DOM
   */
  setHTML() {
    const weatherSummary = sessionStorage.getItem('weatherSummary')
    const weatherTemp = sessionStorage.getItem('weatherTemp')
    const weatherTime = new Date(parseInt(sessionStorage.getItem('weatherTime') * 1000))
    const timeDiff = Math.floor(this.now.getHours() - weatherTime.getHours())

    this.tempContainer.innerHTML = Math.floor(weatherTemp)
    this.summaryContainer.innerHTML = weatherSummary

    this.updateData(timeDiff)
  }
}

new Weather(33.6634, -116.3100)