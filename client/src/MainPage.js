import React, { useState, useReducer, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_ENDPOINT = "/";
const TRENDS = "api/trends?id="
const LOCATION_ID = "1"

const trendsReducer = (state, action) =>  {
  switch(action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    default:
      throw new Error();
  }
};

const List = ({ list }) =>
  list.map((item) => (
    <Item key={item.url} item={item} />
  ));

const Item = ({ item }) => {
  return (
    <a href={item.url}>
    <div className="box">
      <div className="media-content">
        <p><strong>{item.name}</strong>
           <br/>
          {item.tweet_volume ? (
            <span>
              <small>Tweet Volume</small><br/>
              <span className="tag is-link">{item.tweet_volume}</span>
            </span>
          ) : (
            <span>
              <small>Tweet Volume</small><br/>
              <span className="tag is-warning">Not Available</span>
            </span>
          )}
        </p>
      </div>
    </div>
    </a>
  );
};

function MainPage() {
  const [url, setUrl] = useState(`${API_ENDPOINT}${TRENDS}${LOCATION_ID}`);
  const [location, setLocation] = useState(LOCATION_ID);
  const [trends, dispatchTrends] = useReducer(trendsReducer, {
    data: [],
    isLoading: true,
    isError: false
  });

  const handleFormSubmit = (event) => {
    setUrl(`${API_ENDPOINT}${TRENDS}${location}`);
    event.preventDefault();
  }

  const handleFetchTrends = useCallback(async () => {
    dispatchTrends({ type: "FETCH_INIT" });

    const result = await axios.get(url);
    console.log(result.data);

    try {
      dispatchTrends({
        type: "FETCH_SUCCESS",
        payload: result.data[0].trends
      });
    } catch {
      dispatchTrends({ type: "FETCH_FAILURE" });
    }
  }, [url]);

  useEffect(() => {
    handleFetchTrends();
  }, [handleFetchTrends]);

  const handleChange = event => {
    setLocation(event.target.value)
  }

  return(
    <div>
      <section className="hero is-primary">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">
              Twitter Trends
            </h1>
          </div>
        </div>
      </section>
      <br/>
      <div className="container">
        <form onSubmit={handleFormSubmit}>
          <div className="field has-addons">
            <div className="control is-expanded">
              <div className="select is-fullwidth">
                <select 
                  name="location" 
                  value={location} 
                  onChange={handleChange}
                >
                  <option value="1">WorldWide</option>
                  <option value="23424848">India</option>
                  <option value="23424977">United States of America</option>
                  <option value="23424975">United Kingdom</option>
                  <option value="23424948">Singapore</option>
                  <option value="23424856">Japan</option>
                </select>
              </div>
            </div>
            <div className="control">
              <button type="submit" className="button is-primary">Get Trends</button>
            </div>
          </div>
        </form>
      </div>
      <hr/>
      
      {/* {trends.isLoading ? (<p>Loading...</p>) : (console.log(trends.data))} */}
      <div className="container">
        { trends.isError &&
          (<div className="message is-danger">
            <div className="message-body">
              <p>Something went wrong...</p>
            </div>
          </div>)
        }
        {trends.isLoading ? (
          <div className="message is-info">
            <div className="message-body">
              <p>Loading...</p>
            </div>
          </div>
        ) : (
          <List list={trends.data} />
        )}
      </div>
      
    </div>
  );
}

export default MainPage;