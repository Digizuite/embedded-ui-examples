import React, { useState } from 'react';

import styles from './ChangeUrl.module.scss';

interface ComponentProps {
    saveUrl: (url: string) => void;
    currentUrl: string;
  }

const ChangeUrl = ({ saveUrl, currentUrl }: ComponentProps) => {
    const [baseUrl, setBaseUrl] = useState<string>(currentUrl);

    const save = () => {
        saveUrl(baseUrl);
    }

    return (
        <div className={styles.baseUrlBody}>
            <div className={styles.baseUrlContainer}>
            <div className={styles.baseUrlHeader}>
                <p>Enter url</p>
            </div>
            <div className={styles.baseUrlForm}>
                <div className={styles.baseUrlIconWrapper}>
                <div className={styles.baseUrlIcon}>
                    <i className={styles.iconLink}></i>
                </div>
                <p>Enter the url which users access there Media Manager from.</p>
                </div>
                <div className={styles.baseUrlWrapper}>
                    <input
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        className={styles.baseUrlField}
                        minLength={10}
                        placeholder="Paste or write the url here"
                        name="baseUrlField"
                        id="baseUrlField"
                        required
                    />
                    <button onClick={save}
                            className={styles.baseSubmitButton}
                            type="submit">Continue</button>
                    <br />
                    <div className={styles.baseUrlError}>
                        <span>Contact Digizuite <a href="https://www.digizuite.com/get-in-touch" target="_blank" rel="”noreferrer”">here</a>.</span>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default ChangeUrl;
