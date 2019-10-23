import React from 'react'
import { Loading } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import styles from './styles.module'

const LoadingComponent = props => {
  return <div className={styles.container}>
    <Loading
      {...props}
      className={classNames(styles.loading, props.className)}
    />
  </div>
}

export default LoadingComponent
