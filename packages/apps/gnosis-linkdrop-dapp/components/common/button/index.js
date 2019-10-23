import React from 'react'
import { Button } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import styles from './styles.module'

const ButtonComponent = props => {
  return <Button
    {...props}
    className={classNames(styles.container, props.className, {
      [styles.loading]: props.loading,
      [styles.disabled]: props.disabled
    })}
  />
}

export default ButtonComponent
