---
title: "Self-Signed WHQL Certificate for Testing"
meta_title: ""
description: ""
date: 2025-03-24T12:00:00Z
image: ""
categories: ["OS"]
author: "Nick Kuo"
tags: ["Windows"]
draft: false
---
# Root Certificate
```cpp
$params = @{
    Type = 'Custom'
    SerialNumber = '28cc3a25bfba44ac449a9b586b4339aa'
    KeyAlgorithm = 'RSA'
    HashAlgorithm = 'SHA256'
    NotBefore = (Get-Date -Year 2010 -Month 6 -Day 24 -Hour 5 -Minute 57 -Second 24)
    NotAfter = (Get-Date -Year 2035 -Month 6 -Day 24 -Hour 6 -Minute 4 -Second 1)
    KeyUsage = @('DigitalSignature','CertSign','CRLSign')
    Subject = 'CN=Microsoft Root Certificate Authority 2010,O=Microsoft Corporation
    ,L=Redmond,S=Washington,C=US'
    FriendlyName = 'Microsoft Root Certificate Authority 2010'
    CertStoreLocation = 'Cert:\LocalMachine\My'
}
$rootCa = New-SelfSignedCertificate @params
```

Export the certificate to PFX in mmc. Save as `root-ca-custom.pfx`

Extract key:
```cpp
openssl pkcs12 -in root-ca-custom.pfx -nocerts -out root-ca-key-enc.pem
openssl rsa -in root-ca-key-enc.pem -out root-ca-key.pem
```

Extract certificate:
```cpp
openssl pkcs12 -in root-ca-custom.pfx -clcerts -nokeys -out root-ca-custom.cer
```

Result files:
* root-ca-custom.pfx
* root-ca-key.pem
* root-ca-custom.cer

# Intermediate CA

Print all attributes in hex:
```cpp
openssl x509 -in int-ca.cer -certopt ext_dump -text -noout
```

Create config file
- `int-ca-cfg.cnf`
    ```
    [ ca ]
    default_ca = CA_default
    
    [ req ]
    default_bits        = 2048
    default_keyfile     = privkey.pem
    distinguished_name  = req_distinguished_name
    x509_extensions     = v3_ca
    prompt              = no
    encrypt_key         = no
    
    [ req_distinguished_name ]
    C  = US
    ST = Washington
    L  = Redmond
    O  = Microsoft Corporation
    CN = Microsoft Windows Third Party Component CA 2012
    
    [ v3_ca ]
    keyUsage            = digitalSignature, certificateSign, crlSign
    basicConstraints    = critical, CA:true
    subjectKeyIdentifier= hash
    authorityKeyIdentifier= keyid,issuer
    extendedKeyUsage    = serverAuth, clientAuth
    crlDistributionPoints = URI:http://crl.microsoft.com/pki/crl/products/MicRooCerAut_2010-06-23.crl
    authorityInformationAccess = CA Issuers - URI:http://www.microsoft.com/pki/certs/MicRooCerAut_2010-06-23.crt
    
    [ certificate_extensions ]
    authorityKeyIdentifier = keyid,issuer
    
    [ CA_default ]
    unique_subject = no
    dir             = ./ca
    database        = $dir/db
    new_certs_dir   = $dir/newcerts
    certificate     = ./root-ca-custom.cer
    serial          = $dir/serial
    private_key     = ./root-ca-key.pem
    default_md      = sha256
    policy          = policy_any
    default_days    = 5475  # 15 years from the start date of Apr 18, 2012
    
    [ policy_any ]
    countryName            = match
    stateOrProvinceName    = match
    localityName           = match
    organizationName       = match
    commonName             = supplied
    
    [ certificate ]
    serialNumber          = 0x610BAAC100000000000009
    signatureAlgorithm    = sha256WithRSAEncryption
    validityNotBefore     = 20120418234838Z   # April 18, 2012, 23:48:38 GMT
    validityNotAfter      = 20270418235838Z   # April 18, 2027, 23:58:38 GMT
    
    ```
    
- `int-ca-ext.cnf`
    ```cpp
    keyUsage  = digitalSignature, keyCertSign, cRLSign
    basicConstraints    = critical, CA:true
    subjectKeyIdentifier= hash
    authorityKeyIdentifier= keyid,issuer
    crlDistributionPoints = URI:http://crl.microsoft.com/pki/crl/products/MicRooCerAut_2010-06-23.crl
    authorityInfoAccess = caIssuers;URI:http://www.microsoft.com/pki/certs/MicRooCerAut_2010-06-23.crt
    1.3.6.1.4.1.311.21.1 = DER:020100
    1.3.6.1.4.1.311.20.2 = DER:1e0a00530075006200430041
    ```
    

```cpp
mkdir ca
> ca/db
echo "610baac1000000000009" > ca/serial
```

Generate key & CSR:
```cpp
openssl req -config int-ca-cfg.cnf -newkey rsa:2048 -keyout int-ca-key.pem -out int-ca.csr
```

Sign CSR:
```cpp
openssl ca -config int-ca-cfg.cnf -out int-ca-custom.cer -startdate 20120418234838Z -enddate 20270418235838Z -cert root-ca-custom.cer -keyfile root-ca-key.pem -in int-ca.csr -extfile int-ca-ext.cnf
```

Result files:
* int-ca.csr
* int-ca-key.pem
* int-ca-cfg.cnf
* int-ca-ext.cnf
* int-ca-custom.cer

# Leaf Certificate

Print all attributes in hex:
```cpp
openssl x509 -in whcp.cer -certopt ext_dump -text -noout
```

Create config file:
- `whcp-cfg.cnf`
    ```cpp
    [ ca ]
    default_ca = CA_default
    
    [ req ]
    default_bits        = 2048
    default_keyfile     = privkey.pem
    distinguished_name  = req_distinguished_name
    x509_extensions     = v3_ca
    prompt              = no
    encrypt_key         = no
    
    [ req_distinguished_name ]
    C  = US
    ST = Washington
    L  = Redmond
    O  = Microsoft Corporation
    CN = Microsoft Windows Hardware Compatibility Publisher
    
    [ v3_ca ]
    subjectKeyIdentifier   = hash
    authorityKeyIdentifier = keyid,issuer:always
    basicConstraints       = critical,CA:FALSE
    keyUsage               = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
    extendedKeyUsage       = codeSigning
    subjectAltName         = @alt_names
    
    [ alt_names ]
    DNS.1 = Microsoft Corporation
    serialNumber = 232825+502301
    
    [ certificate_extensions ]
    authorityKeyIdentifier = keyid,issuer
    
    [ CA_default ]
    unique_subject = no
    dir             = ./ca
    database        = $dir/db
    new_certs_dir   = $dir/newcerts
    certificate     = ./int-ca-custom.cer
    serial          = $dir/serial
    private_key     = ./int-ca-key.pem
    default_md      = sha256
    policy          = policy_any
    default_days    = 5475  # 15 years from the start date of Apr 18, 2012
    
    [ policy_any ]
    countryName            = match
    stateOrProvinceName    = match
    localityName           = match
    organizationName       = match
    commonName             = supplied
    
    [ certificate ]
    serialNumber          = 0x610BAAC100000000000009
    signatureAlgorithm    = sha256WithRSAEncryption
    validityNotBefore     = 20120418234838Z   # April 18, 2012, 23:48:38 GMT
    validityNotAfter      = 20270418235838Z   # April 18, 2027, 23:58:38 GMT
    
    ```
    
- `whcp-ext.cnf`
    ```cpp
    extendedKeyUsage  = 1.3.6.1.4.1.311.10.3.39,1.3.6.1.4.1.311.10.3.5,1.3.6.1.5.5.7.3.3
    basicConstraints    = critical, CA:false
    subjectKeyIdentifier= hash
    authorityKeyIdentifier= keyid,issuer
    crlDistributionPoints = URI:http://www.microsoft.com/pkiops/crl/Microsoft%20Windows%20Third%20Party%20Component%20CA%202012.crl
    authorityInfoAccess = caIssuers;URI:http://www.microsoft.com/pkiops/certs/Microsoft%20Windows%20Third%20Party%20Component%20CA%202012.crt
    subjectAltName = dirName:dir_sect
    
    [dir_sect]
    OU = Microsoft Corporation
    serialNumber=232825+502301
    ```
    

Generate key & CSR:
```cpp
openssl req -config whcp-cfg.cnf -newkey rsa:2048 -keyout whcp-key.pem -out whcp.csr
```

Sign CSR:
```cpp
openssl ca -config whcp-cfg.cnf -out whcp-custom.cer -startdate 20120418234838Z -enddate 20270418235838Z -cert int-ca-custom.cer -keyfile int-ca-key.pem -in whcp.csr -extfile whcp-ext.cnf
```

Result file:
* whcp-cfg.cnf
* whcp-ext.cnf
* whcp.csr
* whcp-key.pem
* whcp-custom.cer

# Package to PFX
```cpp
openssl pkcs12 -export -out whcp-custom.pfx -inkey whcp-key.pem -in whcp-custom.cer -certfile int-ca-custom.cer -certfile root-ca-custom.cer
```
