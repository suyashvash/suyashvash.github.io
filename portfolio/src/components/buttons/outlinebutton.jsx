import React from "react";
import './button_styles.css'

export default function OutlineButton(props) {
  return (
    <a href={props.href} onClick={()=>props.onClick() || {}} className="app_link btn btn-outline ">
      {props.title}
    </a>
  );
}
