---
layout: post
title: SSH 사용하여 git clone하기
categories: book
tags: cleanCode 
---

## <span style="color:gray">clone repo using SSH key</span>

---

#### <span style="background-color:black; color:white">자동화 Script</span>

```shell
 #!/bin/bash
 read -p "Enter your Git-Hub Email: " email
 read -p "Enter secure algorithm (rsa or ed25519): " algo

 # check directory
 SSH_DIRECTORY=~/.ssh
 if ! test -d "$SSH_DIRECTORY"; then
   echo "Directory .ssh doesn not exist."
   mkdir ~/.ssh
 fi

 # check Secure algorithm
 if [[ "${algo}" == "rsa" ]] || [[ "${algo}" == "ed25519" ]]
 then
    ssh-keygen -t $algo -b 4096 -C "$email"
    cd ~/.ssh
    eval "$(ssh-agent -s)"
    ssh-add id_${algo}
    cat id_${algo}.pub | pbcopy
 else
    echo "Enter 'rsa' or 'ed25519' in algorithm"
 fi
```

<br>

- pbcopy : 클립보트에 앞의 내용을 복사해준다.