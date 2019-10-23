import React from 'react'
import { Input } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import styles from './styles.module'

const InputComponent = props => {
  return <div className={styles.container}>
    <Input
      {...props}
      className={classNames(styles.input, props.className)}
    />
  </div>
}

export default InputComponent
