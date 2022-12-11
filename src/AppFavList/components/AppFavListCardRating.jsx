import React, { Component } from 'react';

class AppFavListCardRating extends Component {

    displayRating(number) {
        let num = number > 5 ? 5 : number > 0 ? number : 0;

        return num;
    }

    render() {

        return (
            <>
                {+this.props.rating
                    ? <aside className={`${+this.props.rating >= 5
                        ? 'favCard_rate favCard_rate5'
                        : 'favCard_rate'}`
                    }>
                        {this.displayRating(+this.props.rating)}
                    </aside>
                    : null
                }
            </>
        );

    }
}

export default AppFavListCardRating;