# whatap-files

*widget* 및 *mxql* 파일 목록을 google-spreadsheet에 기록합니다.

[MXQL-WIDGET 스프레드시트 바로가기](https://docs.google.com/spreadsheets/d/1vjHBn66PKE11Ge9PyRf8o2ksh9PHQCroB044FovnizY/edit#gid=721111350)

## 설치

```
# git clone & change directory
cd whatap-files

# npm install
yarn install
```

## .env 설정
루트 디렉토리에 *.env* 파일을 생성하고 아래 내용을 붙여넣기 합니다.


```
GOOGLE_PRIVATE_KEY=
GOOGLE_SERVICE_ACCOUNT_EMAIL=

SPREADSHEET_ID=1vjHBn66PKE11Ge9PyRf8o2ksh9PHQCroB044FovnizY
DEFAULT_MXQL_PATH_ARG=/Users/swlee/Documents/work/apm/io.whatap/whatap.server.yard/mxql
DEFAULT_WIDGET_PATH_ARG=/Users/swlee/Documents/work/apm/io.whatap/whatap.server.front.apm/widget
```

- Google SpreadSheet API 사용을 위해 와탭 운영 담당자에게 *GOOGLE_SERVICE_ACCOUNT_EMAIL* 과 *GOOGLE_PRIVATE_KEY* 를 확인해주세요. 

- *SPREADSHEET_ID* 는 whatap-files가 연동된 구글 스프레드 시트의 아이디입니다. 

- *DEFAULT_MXQL_PATH_ARG* 는 관리 중인 mxql 경로를 가르킵니다. 운영에서 제공하는 mxql 목록은 yard 패키지의 /mxql에 위치합니다. 

- *DEFAULT_WIDGET_PATH_ARG* 는 관리 중인 widget 경로를 가르킵니다. 운영에서 제공하는 widget 목록은 front 패키지의 /widget에 위치합니다. 


## 실행

```
yarn start
```

- 명령어 프롬프트가 실행됩니다. 
    1. documentType 선택: -widget / -mxql
    2. documentDir 입력: 해당 파일이 위치한 폴더 경로를 입력합니다. 

- documentDir 미입력 시 .env 의 *DEFAULT_MXQL_PATH_ARG* 또는 *DEFAULT_WIDGET_PATH_ARG*를 참조합니다.

- 최초 실행 시 Git History를 읽는데 2분 정도의 시간이 소요됩니다. 


