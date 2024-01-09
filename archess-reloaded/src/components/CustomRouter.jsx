import React from 'react';

class CustomRouter extends React.Component {
    render() {
        const { currentRoute } = this.props;
        let matchingRoute = <></>

        React.Children.map(this.props.children, child => {
            if (
                React.isValidElement(child) &&
                child.type === Route &&
                child.props.route === currentRoute
            ) {
                matchingRoute = child;
            }
        });


        return (
            <>
                {matchingRoute}
            </>
        );
    }
}

function Route(props) {
  return (
    <>
        {props.children}
    </>
  )
}

export {
    CustomRouter,
    Route
}
