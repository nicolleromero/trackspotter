const { Component } = React;
const { render } = ReactDOM;
const { Provider, useSelector, useDispatch } = ReactRedux;
const { Badge, Button, Col, Container, Dropdown, DropdownButton, Form, FormControl, InputGroup, ListGroup, Navbar, Row, Table } = ReactBootstrap;
const Router = ReactRouterDOM.BrowserRouter;
const Route = ReactRouterDOM.Route;
const Link = ReactRouterDOM.Link;
const Prompt = ReactRouterDOM.Prompt;
const Switch = ReactRouterDOM.Switch;
const Redirect = ReactRouterDOM.Redirect;


// const Home = (props) => {
//   const [prepend, setBody] = React.useState('')

//   return (
//     <Container>
//       <Row className="box align-content-center inline">
//         <InputGroup
//           className="mb-3"
//           onChange={(e) => setPrepend(e.target.value)}
//           value={prepend}>
//           <DropdownButton
//             as={InputGroup.Prepend}
//             variant="outline-secondary"
//             title="Match"
//             id="input-group-dropdown-1"
//           >
//             <Dropdown.Item value="">keyword</Dropdown.Item>
//             <Dropdown.Item value="artist: ">artist</Dropdown.Item>
//             <Dropdown.Item value="album: ">album</Dropdown.Item>
//             <Dropdown.Item value="year: ">year</Dropdown.Item>
//           </DropdownButton>
//           <FormControl aria-describedby="basic-addon1" />
//         </InputGroup>
//       </Row>
//     </Container>
//   );
// }