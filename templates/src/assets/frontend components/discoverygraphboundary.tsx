import { Component } from 'react'
import type { ReactNode } from 'react'

export default class DiscoveryGraphBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    if (this.state.failed) {
      return <div className="discovery-graph-loading" role="status">
        <p>The map could not load. You can still select movies using the buttons below and follow their connections.</p>
      </div>
    }
    return this.props.children
  }
}
