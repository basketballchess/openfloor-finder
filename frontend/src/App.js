/* App.js
This is a single page React app. The entire app is contained on this front page. The page consists of
two main containers: A search bar on top where you can keyword search a CSV of old podcast episodes that 
I scraped, and a table which returns the search results. The search is simply a query of a Pandas dataframe.

Date: 3/19/2023
Author: Basketball Chess
*/

import './App.css';
import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Form, Header, Input, Grid, Container, Table } from 'semantic-ui-react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import axios from 'axios'


function App() {
  /* placeholders for the search queries */ 
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
 
  /* functions for the date picker */
  const onStartChange = (event, data) => setStartDate(data.value);
  const onEndChange = (event, data) => setEndDate(data.value);

  /* placeholder for search results */
  const [results, setResults] = React.useState("");

  /* When the user submits, there is a post request to the Flask backend to pull the data */
  const handleSubmit = e => {
  // Prevent the default submit and page reload
  e.preventDefault()

  // Handle validations
  axios.post(
    "http://localhost:5000/search", {
      "title": title,
      "summary": summary,
      "startDate": startDate,
      "endDate": endDate,
  })
  .then(function (response) {
    setResults(response.data)
  })
  .catch(function (error) {
    console.log(error);
  });
  }


  return (
  <>
  {/* Top half - search bar */}
  <br />   
  <br />
  <br />
  <br />

  <Header as="h1" textAlign="center">
    Want to find old Andrew Sharp-era Open Floor podcast episodes?
  </Header>
  <Header as="h3" textAlign="center">
    You can find episodes by searching podcast title or podcast description keywords. You can also search by date!
  </Header>
  <Container verticalAlign>
    <Grid centered divided celled padded>
      <Grid.Column verticalAlign>
        <Form>
          <Form.Field width={6}>
            <Header>Podcast Title</Header>
            <Input placeholder='Title' onChange={(e) => setTitle(e.target.value)} />
          </Form.Field>
          <Form.Field width={6}>
            <Header>Description</Header>
            <Input placeholder='Summary' onChange={(e) => setSummary(e.target.value)}/>
          </Form.Field>
          <Form.Field>
            <Header> Date Range (Beginning) </Header>
            <SemanticDatepicker onChange={onStartChange}/>
          </Form.Field>
          <Form.Field>
            <Header> Date Range (End) </Header>
            <SemanticDatepicker onChange={onEndChange}/>
          </Form.Field>
          <Button type='submit' onClick={handleSubmit}>Submit</Button>
        </Form>
      </Grid.Column>
    </Grid>
  </Container>

  <br /> <br /> <br /> <br />

  {/* Bottom half - Results table */
  results && 

    <Container>
    <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell> Episode No. </Table.HeaderCell>
        <Table.HeaderCell>Title</Table.HeaderCell>
        <Table.HeaderCell>Summary</Table.HeaderCell>
        <Table.HeaderCell>Date</Table.HeaderCell>
        <Table.HeaderCell>Link</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {results.map((arr, index) => {
        return (
          <Table.Row>
            <Table.Cell> {arr["Index"]} </Table.Cell>
            <Table.Cell>{arr["Title"]}</Table.Cell>
            <Table.Cell>{arr["Summary"]}</Table.Cell>
            <Table.Cell>{arr["Date"]}</Table.Cell>
            <Table.Cell><a href={arr["Link"]}>Episode Link</a></Table.Cell>
          </Table.Row>

        )
      }
        
      )}
    </Table.Body>
    </Table>
    </Container>
  }
  </>
  );
}

export default App;