import * as React from 'react'
import { connect } from 'react-redux'
import Interactable from 'react-native-interactable'
import {
  View,
  ViewStyle,
  Animated,
  TouchableWithoutFeedback,
  Dimensions
 } from 'react-native'
 import Router from '../routers'
 import { Color, centering } from '../styles'

 const { width, height } = Dimensions.get('window')

 const WIDTH_FACTOR = width / 375
 const HEIGHT_FACTOR = (height - 75) / 667

 const snapPoints = [
  {x: -150 * WIDTH_FACTOR, y: 0},
  {x: -150 * WIDTH_FACTOR, y: -150 * HEIGHT_FACTOR},
  {x: -150 * WIDTH_FACTOR, y:  150 * HEIGHT_FACTOR},
  {x: -150 * WIDTH_FACTOR, y: -270 * HEIGHT_FACTOR},
  {x: -150 * WIDTH_FACTOR, y: 270 * HEIGHT_FACTOR},
  {x:  150 * WIDTH_FACTOR, y: 0},
  {x:  150 * WIDTH_FACTOR, y:  150 * HEIGHT_FACTOR},
  {x:  150 * WIDTH_FACTOR, y: -150 * HEIGHT_FACTOR},
  {x:  150 * WIDTH_FACTOR, y: -270 * HEIGHT_FACTOR},
  {x:  150 * WIDTH_FACTOR, y: 270 * HEIGHT_FACTOR}
]

interface IProps {
  visable: boolean
}

class DownloadBall extends React.Component<IProps, any> {
  private scaleAnim: Animated.Value

  constructor(props) {
    super(props)
    this.scaleAnim = new Animated.Value(0)
  }

  onPress = () => {
    Router.toDownloading()
  }

  componentWillReceiveProps ({ visable }) {
    if (visable !== this.props.visable) {
      visable
        ? this.hide()
        : this.show()
    }
  }

  show() {
    const { timing, sequence } = Animated
    sequence([
      timing(this.scaleAnim, { toValue: 1.5, duration: 300 }),
      timing(this.scaleAnim, { toValue: 1, duration: 300 })
    ]).start()
  }

  hide() {
    Animated.timing(this.scaleAnim, { toValue: 0, duration: 300 }).start()
  }

  render() {
    return (
      <View style={styles.frame} pointerEvents='box-none'>
        <Interactable.View
          snapPoints={snapPoints}
          initialPosition={{ x: -150 * WIDTH_FACTOR, y: -270 * HEIGHT_FACTOR }}
        >
          <TouchableWithoutFeedback onPress={this.onPress}>
            <Animated.View
              style={[styles.ball, {
                transform: [{
                  scale: this.scaleAnim
                }]
              }]}
            >
              <View />
            </Animated.View>
          </TouchableWithoutFeedback>
        </Interactable.View>
      </View>
    )
  }

}

function mapStateToProps ({
  download: {
    downloading
  }
}) {
  return {
    visable: Array.isArray(downloading) && downloading.length > 0
  }
}

export default connect(mapStateToProps)(DownloadBall)

const styles = {
  frame: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    ...centering
  } as ViewStyle,
  ball: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: Color.main,
    borderColor: '#dddddd',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 0
    },
    shadowRadius: 3,
    shadowOpacity: 0.8
  } as ViewStyle
}
