import Script from 'next/script'
import React from 'react'

interface AdsenseProps {
    pubID: string
}

const Adsense = ({ pubID }: AdsenseProps) => {

    return (
        <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pubID}`} />
    )
}

export default Adsense