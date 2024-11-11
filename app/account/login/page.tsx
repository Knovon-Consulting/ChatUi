import React from "react";
import Row from 'react-bootstrap/Row';
import Formbox from "../formbox/page";
import Sidepannel from "../sidepannel/page";


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