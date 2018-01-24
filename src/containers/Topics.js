// @flow

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link, Route} from 'react-router-dom';
import _ from 'lodash';

import {fetchAll} from "../reducers/topics";

import FlashMessage from '../components/FlashMessage';
import type {TopicType} from "../components/Topic";

import Code from '../components/Code';
import Note from '../components/Note';
import CueCard from '../components/CueCard';
import Quiz from '../components/quiz/Quiz';
import type {ContextRouter} from "react-router-dom";

const Segments = (props) => (
    <div>
        <ul>{
            _.map(props.segments, segment =>
                <li key={`${segment.type}-${segment._id}`}>
                    <Link to={`${props.match.url}/${segment.type}/${segment._id}`}>
                        {segment.type} {segment._id}
                    </Link>
                </li>
            )
        }</ul>

        <p>[[ SEGMENTS</p>
        <Route path={`${props.match.path}/:segmentType/:segmentId`}
               render={routeProps => {
                   const segmentType = routeProps.match.params.segmentType || '[UNDEFINED]';
                   const segmentId = routeProps.match.params.segmentId || '[UNDEFINED]';
                   const segment = props.segments.find(seg => seg.type === segmentType && seg._id === segmentId);
                   let key = `${segmentType}-${segmentId}`;
                   switch(segmentType) {
                       case 'code':
                           return <Code key={key} code={segment}/>;
                       case 'cue-card':
                           return <CueCard key={key} cuecard={segment}/>;
                       case 'note':
                           return <Note key={key} note={segment}/>;
                       default:
                           throw new Error(`Invalid segment type '${segment.type}'`);
                   }
               }}
        />
        <p>SEGMENTS ]]</p>
    </div>
);

const Cells = (props: any) => {
    return (
        <div>
            <ul>{
                _.map(props.topic.cells, cell =>
                    <li key={cell._id}>
                        <Link to={`${props.match.url}/${cell.type}/${cell._id}`}>
                            {cell.type} {cell._id}
                        </Link>
                    </li>
                )
            }</ul>

            <p>[[ CELLS</p>
            <Route path={`${props.match.path}/:cellType/:cellId`}
                   render={routeProps => {
                       const cellType = routeProps.match.params.cellType;
                       const cellId = routeProps.match.params.cellId;
                       const cell = props.topic.cells.find(c => c._id === cellId);
                       switch (cellType) {
                           case 'listing':
                               return <Segments {...routeProps} segments={cell.segments}/>;
                           case 'quiz':
                               return <Quiz key={cell._id} quiz={cell} onSubmit={(val) => console.log(val)}/>;
                           default:
                               throw new Error(`Invalid cell type ${cellType || '[Unknown]'}`);
                       }
                   }}
            />
            <p>CELLS ]]</p>
        </div>
    );
};

type Props = ContextRouter & {
    topicsById: { [string]: TopicType },
    isFetchActive: boolean,
    error: string,
    fetchAll: void => void,
};

class Topics extends Component<Props> {
    componentDidMount() {
        this.props.fetchAll();
    }

    render () {
        if (_.size(this.props.topicsById) === 0) {
            return <p>LOADING</p>;
        } else {
            return (
                <div>
                    {this.props.error && <FlashMessage message={this.props.error}/>}

                    <div className="columns">
                        <div className="column">
                            TOPICS
                        </div>
                        <div className="column">
                            CELLS
                        </div>
                        <div className="column">
                            SEGMENTS
                        </div>
                    </div>

                    <ul>{
                        _.map(this.props.topicsById, topic => (
                            <li key={topic._id}>
                                <Link to={`${this.props.match.url}/${topic._id}`}>
                                    {topic._id}
                                </Link>
                            </li>
                        ))
                    }</ul>

                    <p>[[TOPICS</p>
                    <Route path={`${this.props.match.path}/:topicId`}
                           render={(routeProps: ContextRouter) => {
                               console.log(routeProps);
                               const topicId = routeProps.match.params['topicId'];
                               if (topicId !== null) {
                                   const topic = this.props.topicsById[topicId || 'Unknown'];
                                   return <Cells {...routeProps} topic={topic}/>
                               } else {
                                   return <p>ERROR</p>;
                               }
                           }}
                    />
                    <p>TOPICS]]</p>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    const {byId, isFetchActive, error} = state.topics;
    return {
        topicsById: byId,
        isFetchActive,
        error
    };
};

export default connect(mapStateToProps, {fetchAll})(Topics);
