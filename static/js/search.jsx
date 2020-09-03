const { Autocomplete, Component, useEffect, useRef, useState, useCallback, useMemo } = React;
const { render } = ReactDOM;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, FormGroup, InputGroup, ListGroup, Navbar, OverlayTrigger, Row, Table, Tooltip } = ReactBootstrap;

// const { ReactStructuredQuerySearch } = ReactStructuredQuerySearch;
const { DragDropContext, Droppable, Draggable } = ReactBeautifulDnd;
// const { ReactAutocomplete } = ReactAutocomplete;
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;
const useHistory = ReactRouterDOM.useHistory;

const PREFIXES = {
  '': 'keyword',
  'artist:': 'artist',
  'album:': 'album',
  'genre:': 'genre',
  'year:': 'year',
};

const OPERATORS = {
  'equals': 'equals',
  'contains': 'contains',
  'starts with': 'starts with',
  'ends with': 'ends with',
};

function StructuredSearch(props) {

  return (
    <Row className="d-flex justify-content-center inline align-items-center">
      <Form onSubmit={props.handleSearch}>
        <Form.Row className="inline">
          <Col xs="auto" className="inline search-top">
            <Form.Group controlId="exampleForm.SelectCustom">
              <Form.Control
                as="select"
                custom
                value={props.prefix}
                onChange={(e) => props.setPrefix(e.target.value)}
              >
                {Object.keys(PREFIXES).map((key) => {
                  return (
                    <option value={key}>{PREFIXES[key]}</option>
                  )
                }
                )}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs="auto" className="inline search-top">
            <Form.Group controlId="exampleForm.SelectCustom2">
              <Form.Control
                as="select"
                custom
                value={props.wildcard}
                onChange={(e) => props.setWildcard(e.target.value)}
              >
                {Object.keys(OPERATORS).map((key) => {
                  return (
                    <option value={key}>{OPERATORS[key]}</option>
                  )
                }
                )}
              </Form.Control>
            </Form.Group>
          </Col>
          {props.prefix !== "genre:" && props.prefix !== "year:" && (
            <Col xs="auto" className="inline search-top fixed-width">
              <FormControl
                type="text"
                value={props.param}
                placeholder="Enter a term"
                onChange={(e) => props.setParam(e.target.value)}
                className="mr-sm-2 inline"
              /></Col>
          )}
          {props.prefix === "year:" && (
            <Col xs="auto" className="inline search-top fixed-width">
              <FormControl
                type="text"
                value={props.param}
                placeholder="Enter a year or span"
                onChange={(e) => props.setParam(e.target.value)}
                className="mr-sm-2 inline"
              /></Col>
          )}
          {props.prefix === "genre:" && (
            <Col xs="auto" className="inline search-top fixed-width">
              <Autosuggest
                type="text"
                value={props.param}
                setParam={props.setParam}
                placeholder="Select a genre"
                onChange={(e) => props.setParam(e.target.value)}
                className="mr-sm-2 inline form-control"
              />
            </Col>
          )}
          <Col xs="auto" className="inline search-top">
            <NumSongs
              numSongs={props.numSongs}
              setNumSongs={props.setNumSongs}
            />
          </Col>
          <Col xs="auto" className="inline search-top">
            <Button
              variant="outline-secondary inline"
              type="submit"
            >
              <i class="fa fa-search-plus"></i> Search
              </Button>
              &nbsp;
              <Button
              variant="outline-secondary inline"
              onClick={props.handleReset}
            >
              Clear
              </Button>
          </Col>
        </Form.Row>
      </Form>
    </Row >
  );
}

// function StructuredSearch(props) {
//   let [SymbolData, setSymbolData] = React.useState([]);

//   // NOTE: The operator will seen to UI only if props isAllowOperator={true}
//   const options = [
//     {
//       category: "Symbol",
//       type: "textoptions",
//       operator: ["==", "!="],
//       options: getSymbolOptions
//     },
//     {
//       category: "Name",
//       type: "text",
//       isAllowDuplicateCategories: false,
//       operator: () => ["==", "!==", "containes"]
//     },
//     { category: "Price", type: "number" },
//     { category: "MarketCap", type: "number" },
//     { category: "IPO", type: "date" },
//     {
//       category: "Sector",
//       type: "textoptions",
//       fuzzySearchKeyAttribute: "sectorName",
//       isAllowCustomValue: false,
//       isAllowDuplicateOptions: false,
//       options: getSectorOptions
//     },
//     {
//       category: "Industry",
//       type: "textoptions",
//       isAllowCustomValue: false,
//       options: getIndustryOptions
//     }
//   ];


//   /**
//    * [getSymbolOptions Get the values using Ajax call]
//    * @return {[type]}
//    */
//   const getSymbolOptions = () => {
//     if (SymbolData.length === 0) {
//       return new Promise((resolve, reject) => {
//         setTimeout(() => {
//           setSymbolData({ SymbolData: ["TFSC", "PIL", "VNET"] }, () => {
//             return resolve(SymbolData);
//           });
//         }, 2000);
//       });
//     } else {
//       return SymbolData;
//     }
//   };

//   /**
//    * [getSectorOptions Get the values for sector category]
//    * @return {[array]}
//    */
//   function getSectorOptions() {
//     return [{ sectorName: "Finance", id: 1 }, { sectorName: "Consumer Services", id: 2 }, { sectorName: "Services", id: 3 }];
//   }

//   function getIndustryOptions() {
//     return [{ name: "Business Services", id: 1 }, { name: "Other Specialty Stores", id: 2 }];
//   }

//   function getTokenItem(obj) {
//     let val = obj.children;
//     return `${val["category"]}: val`;
//   }


//   return (
//     <div className="container">
//       <ReactStructuredQuerySearch
//         defaultSelected={[
//           { category: "Sector", value: { sectorName: "Finance", id: 1 } },
//           { category: "Sector", value: { sectorName: "Consumer Services", id: 2 } },
//           { category: "Industry", value: { name: "Other Specialty Stores", id: 2 } }
//         ]}
//         options={options}
//         //renderTokenItem={this.getTokenItem}
//         updateOptions={({ updatedValues, addedValue }) => {
//           if (addedValue && addedValue.category === "Symbol" && addedValue.value === "TFSC") {
//             options.push({
//               category: "New Category",
//               type: "text"
//             });
//             return options;
//           }
//         }}
//         onTokenAdd={val => console.log(val)}
//         customClasses={{
//           input: "filter-tokenizer-text-input",
//           results: "filter-tokenizer-list__container",
//           listItem: "filter-tokenizer-list__item"
//         }}
//       />
//     </div>
//   );
// }
