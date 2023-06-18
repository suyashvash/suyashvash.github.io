import React from 'react';

export default function ProjectCard({flx,Name,Tech,projectLink,projectMedia,projValue,projectGit,about}) {

    let classWrapper = "portWrapper " + flx;
    let projBtn = null;
    const Mode=()=>{
        if(projectLink=="Visit"){projBtn= <a href={projectGit} target="blank" className="projLink">Visit </a>;}
        else if(projectLink=="Git"){projBtn = <a href={projectGit} target="blank" className="projLink">GitHub</a>;}
        return(projBtn)
    }

    return(
        <div className= {classWrapper} >
        <div className="flip-card" style={{backgroundImage: `url(${projectMedia})`}}>
            <div  className="fCard" id="fCard1"></div>
        </div>     
        <div className="cardDetails">
            <div className="detailHeader">
                <span className="projName">{Name}</span>
                <span className="projTech">{Tech}</span>
                <div className="mobileV"><Mode/></div>
            </div>
            <div className="detailBody">
                <span className="detailHead">About</span>
                <p className="detailPara">{about} </p>
                <div className="linkHodler"><Mode/></div>
            </div>
        </div>
    </div>

    )
    
}