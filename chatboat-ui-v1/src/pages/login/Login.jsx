import React from "react";
import Sidepannel from "./Sidepannel";
import Row from 'react-bootstrap/Row';
import Formbox from "./Formbox";
function Login(){
return <>
<div className="lg_O">
<Row className="g-0">
    <Sidepannel></Sidepannel>
    <Formbox></Formbox>
</Row>

</div>
</>
}

export default Login;