import React from 'react';
import {
  ART,
} from 'react-native';

const {
  Shape,
} = ART;


type Props = {
  color: any,
  d: () => any,
};

export default class AnimShape extends React.Component {

  constructor(props: Props) {
    super(props);
    this.state = {
      path: '',
    }
  }

  componentWillUnmount() {
  }

  componentWillMount() {
    this.computeNextState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.computeNextState(nextProps);
  }

  computeNextState(nextProps) {
    const {
      d,
    } = nextProps;

    const graph = nextProps.d();

    this.setState({
      path: graph.path,
    });
  }

  render() {
    const path = this.state.path;

    return (
       <Shape
         d={path}
         stroke={this.props.color}
         fill={this.props.color}
         />
    );
  }
}
