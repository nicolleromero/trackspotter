import React from 'react';
import { findDOMNode } from 'react-dom';

export class TrackRow extends React.Component {
  getSnapshotBeforeUpdate(prevProps) {
    const isDragStarting = this.props.isDragging && !prevProps.isDragging;
    if (!isDragStarting) {
      return null;
    }

    const node = findDOMNode(this);
    return node.getBoundingClientRect();
  }

  componentDidUpdate(
    prevProps,
    prevState,
    snapshot,
  ) {
    if (snapshot) {
      const node = findDOMNode(this);
      node.style.display = 'table';
      node.style.width = `${snapshot.width}px`;
    } else if (!this.props.isDragging && prevProps.isDragging) {
      const node = findDOMNode(this);
      node.style.removeProperty('display');
      node.style.removeProperty('width');
    }
  }

  render() {
    const { innerRef, isDragging, ...props } = this.props;

    return (
      <tr
        {...props}
        ref={innerRef}
        align="center"
        scope="row"
      />
    );
  }
}