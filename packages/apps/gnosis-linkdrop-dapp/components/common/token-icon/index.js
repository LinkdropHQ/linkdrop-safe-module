import React from 'react'
import styles from './styles.module'

const TokenIcon = ({ icon }) => {
  return <div className={styles.container}>
    <img src={icon} />
  </div>
}

export default TokenIcon
