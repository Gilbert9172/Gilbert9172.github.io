---
layout: post
title: SpringBatch 구조
categories: spring
tags: springBatch
---

## <span style="color:gray">Spring Batch 구조</span>

<img src="/assets/img/spring/batch/batch1.png">

---

<br>

### <span style="color:gray">Job</span>

> Job은 간단히 Step의 컨테이너(묶음?)이다.

**`Job`** 은 배치 작업이다. 혹은 Flow라고도 부른다. 최소 하나의 Step을 가져야하며, 

엄청나게 복잡한 Job이 아닌 이상 2-10개의 Step을 권장한다. 다른 Spring 프로젝트와 마찬가지로 

Job은 XML 구성 파일 또는 Java 기반 구성과 함께 연결된다. 이 구성을 "작업 구성"이라고 할 수 

있다. 그러나 Job은 다음 다이어그램과 같이 전체 계층 구조의 최상위에 불과하다.

<img src="/assets/img/spring/batch/job.png">

Spring Batch에서 Job은 단순히 Step 인스턴스의 컨테이너이다. 이것은 논리적으로 연결된 Flow와 

모든 단계의 전역 속성을 구성할 수 있다.(재시작성과 같은). 작업 구성에는 다음이 포함된다.

- 작업의 간단한 이름이다.

- Step 인스턴스의 정의 및 순서. 

- 작업을 다시 시작할 수 있는지 여부

Java Configuration을 사용하는 사람들을 위해 Spring Batch는 SimpleJob 클래스의 형태로 

Job 인터페이스의 기본 구현을 제공하여 Job 위에 몇 가지 표준 기능을 생성합니다. 

그리고 예제와 같이 빌더 컬렉션을 작업 인스턴스화에 사용할 수 있습니다.

```java
@Bean
public Job footballJob() {
    return this.jobBuilderFactory.get("footballJob")
                     .start(playerLoad())
                     .next(gameLoad())
                     .next(playerSummarization())
                     .build();
}
```


<br>

#### <span style="color:gray">JobInstance</span>

배치가 실제 실행되면, 각각의 실행을 **`Instance`** 라고 한다. 하루가 끝날때 수행되는 "EndOfDay"라는 

이름의 Job이 있다고 해보자. 물론 Job(EndOfDay)이 하나만 있지만, 매일 매일 수행되므로 각각 별도의 

작업으로 생각해야한다. Job(EndOfDay)의 경우 하루에 하나의 논리적인 ***<span style="background-color:#66CDAA">JobInstance</span>*** 가 있는 셈이다.

그런데 만약에 1월1일 실행이 첫 번째 시도에 실패하고, 다음 날 다시 실행되더라도 1월1일의 실행이다.

따라서 각 JobInstance는 여러번 실행될 수 있고, 특정 Job에 해당하는 하나의 JobInstance만 가질 수 

있다. 그리고 JobParameters 식별은 실행되는 중에만 할 수 있다.

<br>

JobInstance의 의미는 로드될 데이터와는 아무런 관련이 없다. 데이터가 로드되는 방식을 결졍하는

것은 전적으로 ***<span style="background-color:#66CDAA">ItemReader</span>*** 구현에 달려있다. 

예를 들어, Job(EndOfDay)에서 'effective data' 또는 'schedule date'라는 데이터를 가지고 있는

컬럼이 있을 수 있다. 따라서 1월1일 실행은 1일의 데이터만 로드하고 1월2일 실행은 2일의 데이터만 

로드한다. 이 결정은 비즈니스 결정일 가능성이 높기 때문에 결정하는 것은 ItemReader의 몫이다.

그러나 동일한 JobInstance를 사용하면 이전 실행의 '상태'가 사용되는지 여부가 결정된다.

새로운 JobInstance를 사용한다는 것은 '처음부터 시작'을 의미하고, 기존 인스턴스를 사용한다는 것은

일반적으로 '중단된 곳에서 시작'을 의미한다.


<br>

#### <span style="color:gray">JobParameters</span>

Job과 JobInstance의 차이를 공부하면서 아래와 같은 의문이 생겼을 것이다. 

그렇다면 각각의 JobInstance는 어떻게 구분하는거지🧐? 정답은 바로!!! ***<span style="background-color:#66CDAA">JobParameters</span>*** 다.

JobParameters 객체는 일괄작업(Batch-Job)을 시작할 때 사용되는 매개변수들을 가지고 있다.

이 매개변수들은 JobInstance 실행 도중에 각 JobInstance를 식별을 위해 사용 되거나 참고 데이터로

사용할 수 있다.

<img src="/assets/img/spring/batch/JobParameters.png">

여기서 유추할 수 있는 것은 **`JobInstance`** = **`Job`** + (Identifing) **`JobParameters`** 라는 것이다.

이를 통해 개발자는 전달되는 매개변수를 통해 JobInstance가 정의되는 방식을 효과적으로 컨트롤할 수 있다.

---

<br>

#### <span style="color:gray">JobExection</span>

JobExecution은 Job을 실행하려는 시도를 의미한다. 실행은 실패 또는 성공으로 끝날 수 있지만,

주어진 실행에 해당하는 JobInstance는 실행이 성공적으로 완료되지 않는 한 완료된 것으로 간주되지

않는다. 위에서 예로 들었던 Job(EndOfDay)를 계속 예로 들어서, 1월1일 JobInstance는 실패했다고 

하자. 만약 첫 번째 실행과 동일한 Identifing JobParameters로 다시 실행하면 새로운 JobExecution이 

생성된다. 그러나 여전히 JobInstance는 오직 한 개다. 

***<span style="background-color:yellow">다시 실행했다고 JobInstance가 두개가 되진 않는다.</span>***

<br>

Job은 Job이 무엇이고 어떻게 실행되는지 정의하고, JobInstance는 주로 재시작의 의미를 올바르게 

전달하기 위해 Execution을 그룹화 하는 것이다. 그러나 JobExecution은 실행 중에 실제로 발생한

일에 대한 "기본 저장 메커니즘(primary storage mechanism)"이며 아래의 표에 표시된 것 처럼 

제어하고 유지해야 하는 더 많은 속성들을 포함하고 있다. 

> 표는 docs에서 확인

표에 있는 속성들은 현재 실행 상태를 결정하기 때문에 중요하다. 예를 들어, 01월01의 작업이

21:00에 실행되고 21:30에 실패하면 일괄 메타데이터 데이블에 다음 항목이 만들어진다.

|JOB_INST_ID|JOB_NAME|
|-----------|--------|
|1|EndOfDayJob|

|JOB_EXECUTION_ID|TYPE_CD|KEY_NAME|DATE_VAL|IDENTIFYING|
|----------------|-------|--------|--------|-----------|
|1|DATE|schedule.Date|2022-01-01 00:00:00|True|

|JOB_EXEC_ID|JOB_INST_ID|START_TIME|END_TIME|STATUS|
|----------------|-------|--------|---------|------|
|1|1|2022-01-01 21:00|2022-01-01 21:30|FAILED|

<br>

01월02일 되면 1월2일의 작업도 시작해야 하며 1일 작업이 마무리된 후 바로 실행된다.

두 작업이 동일한 데이터에 엑세스를 시도하여 데이터베이스 수준에서 잠금 문제를 일으킬

가능성이 있는 경우를 제외하고 하나의 JobInstance를 차례로 시작해야 한다는 요구 사항은 없다.

작업이 실행되어야 하는 시기를 결정하는 것은 전적으로 스케쥴러에 달려 있다. 별도의 JobInstance라

SpringBatch는 동시에 실행되는 것을 막지 않는다. 만약 다른 JobInstance가 이미 실행중인데 

동일한 JobInstance를 실행하려고 하면 **`JobExecutionAlreadyRunningException`** 을 발생시킨다.

수행 결과는 아래와 같다.

|JOB_INST_ID|JOB_NAME|
|-----------|--------|
|1|EndOfDayJob|
|2|EndOfDayJob|

|JOB_EXECUTION_ID|TYPE_CD|KEY_NAME|DATE_VAL|IDENTIFYING|
|----------------|-------|--------|--------|-----------|
|1|DATE|schedule.Date|2022-01-01 00:00:00|True|
|2|DATE|schedule.Date|2022-01-01 00:00:00|True|
|3|DATE|schedule.Date|2022-01-02 00:00:00|True|

|JOB_EXEC_ID|JOB_INST_ID|START_TIME|END_TIME|STATUS|
|----------------|-------|--------|---------|------|
|1|1|2022-01-01 21:00|2022-01-01 21:30|FAILED|
|2|1|2022-01-02 21:00|2022-01-02 21:30|COMPLETED|
|3|2|2022-01-02 21:31|2022-01-01 21:29|COMPLETED|

---

<br>

### <span style="color:gray">Step</span>

**`Step`** 은 일괄작업의 독립적이고 순차적인 단계를 캡슐화하는 도메인 객체이다.

쉽게 말해서 ***<span style="background-color:yellow">모든 Job은 하나 이상의 Step으로 구성된다.</span>*** Step에서는 실제 배치 처리를 

정의하고 제어하는데 필요한 모든 정보가 포함된다. 주언진 Step의 내용은 개발자의 

재량에 달려 있기 떄문에 설명하기가 애매한 부분이 있다. Step은 개발자가 원하는 만큼

간단할 수 도 있고 복잡할 수 도 있다. 간단한 단계는 파일에서 데이터베이스로 데이터를

로드할 수 있는데 구현에 따라 어느정도 차이는 있겠지만 코드가 거의 필요없다.

더 복잡한 단계에는 복잡한 비즈니스 로직이 추가될 수 있다. 아래의 그림에서 볼 수 있듯

Step에는 JobExecution과 상관관계가 있는 개별 ***<span style="background-color:#66CDAA">StepExecution</span>*** 이 있다.


<img src="/assets/img/spring/batch/step.png">

---

<br>

#### <span style="color:gray">StepExection</span>

StepExecution은 하나의 Step의 실행 시도를 나타낸다. JobExecution과 유사하게 Step이

실행될 때마다 새로운 StepExecution이 생성된다. 그러나 이전 Step이 실행되지 않으면 

해당 단계에 대한 실행이 지속되지는 않는다. StepExecution은 해당 단계가 Step이 시작될

때만 생성된다. 

<br>

Step의 실행은 StepExecution 클래의 객체로 표시된다. 각 실행에는 해당 Step, JobExecution,

트랜잭션 관련 데이터(커밋, 롤백 횟수, 시작 및 종료 시간)가 포함된다. 추가적으로 각 Step은 

**`ExecutionContext`** 를 포함하고 있다. **`ExecutionContext`** 은 개발자가 일괄 실행에서 

유지해야 하는 모든 데이터(다시 시작하는데 필요한 통계 또는 상태 정보)를 포함한다.

> 표는 docs에서 확인

---

<br>

### <span style="color:gray">ExecutionContext</span>

---

<br>

### <span style="color:gray">JobRepository</span>

배치가 수행될 때, 수행되는 메타 데이터를 관리하고 시작시간, 종료 시간, Job의 상태 등

배치수행관련 데이터를 저장 저장한다. JobRepository는 위에서 언급한 모든 Streotype에 

대한 지속성 메커니즘이다. JobLauncher, Job 및 Step 구현을 위한 CRUD 작업을 제공한다.

Job이 처음 실행되면 repository에서 JobExecution을 가져오고, 실행 과정에서 

StepExecution 및 JobExecution의 구현을 repository로 전달하여 유지한다.

<br>

자바 설정 파일을 사용한다면 **`@EnableBatchProcessing`** 을 사용하면된다. 이 것은 

기본적으로 자동으로 구성된 구성 요소 중 하나인 JobRepository를 제공해준다.

---

<br>

### <span style="color:gray">JobLauncher</span>

JobLauncher는 다음 예제와 같이 주어진 JobParameters 세트로 작업을 시작하기 위한 

간단한 인터페이스를 나타냅니다.

```java
public interface JobLauncher {

public JobExecution run(Job job, JobParameters jobParameters)
            throws JobExecutionAlreadyRunningException, JobRestartException,
                   JobInstanceAlreadyCompleteException, JobParametersInvalidException;
}
```

구현은 JobRepository에서 유효한 JobExecution을 얻고 작업을 실행해야 한다.

---

<br>

### <span style="color:gray">Item Reader</span>


ItemReader는 말 그대로 데이터 읽기를 담당한다. 정확히는 인터페이스이며 `T read()` 메소드를 

가지고 있다. read 메소드의 반환 값은 ItemProcessor의 Input으로 사용된다. 

요약하자면 읽어드린 데이터를 반환한다. 만약 null을 리턴 할 경우 읽어야 하는 총 데이터의 

마지막임을 나타낸다. DB로 치면 하나의 row를, 파일로 치면 한 line을, JSON Array로 치면 

하나의 element를 반환한다고 생각하면 쉽다. ItemReader 구현 방식에 따라 훨씬 복잡한 구조의 

데이터도 처리 할 수 있다.

아래는 스프링 배치가 제공하는 자주 쓰이는 ItemReader 구현체들인데 굳이 직접 만들지 말고 

왠만하면 out of the box 부품들을 사용하도록 하자.

|구현 클래스|
|-----------|
|FlatFileItemReader|
|HibernateCursorItemReader|
|JdbcCursorItemReader|
|JsonItemReader|
|MongoItemReader|

---

<br>

### <span style="color:gray">Item Processor</span>

ItemProcessor는 ItemReader에게서 Object를 넘겨받아 원하는 방식으로 가공 후에 ItemWriter에게 

넘겨주는 역할을 하며, 한 번에 하나의 아이템을 처리한다. ItemReader와 마찬가지로 인터페이스이며 

Input과 Output을 지정해주어야 한다. Input은 ItemReader에게서 넘겨받는 타입이고 Output은 

ItemWriter에게 넘겨줄 타입이다. 

한마디로 `ItemReader<T>`의 T와 `ItemProcessor<I,O>`의 I는 같은 타입이어야 하고

`ItemProcessor<I,O>`의 O와 `ItemWriter<T>`의 T가 같은 타입이어야 한다.

`process()`로 넘겨받은 item을 가공하여 수정된 item을 그대로 넘기거나 새로운 객체를 만들어 

넘길 수 있다. 참고로 ItemProcessor가 꼭 필요한 건 아니다. 데이터를 가공할 필요가 없는 경우엔 

ItemReader -> ItemWriter로 바로 넘겨도 상관없다.

---

<br>

### <span style="color:gray">Item Writer</span>

ItemReader 혹은 ItemProcessor가 ItemWriter로 데이터를 넘겨주면 리스트에 차곡차곡 쌓아놓는다. 

이때 `commit-interval` 프로퍼티의 정의된 개수만큼 데이터가 모이면 `write 메소드`를 실행하게 

된다. commit-interval은 Step에(정확히는 Step 안에 Chunk에) 설정할 수 있다. 

ItemReader와 마찬가지로 스프링 배치에서 제공해주는 자주 쓰이는 ItemWriter 구현체들이다.

|구현 클래스|
|-----------|
|CompositeItemWriter|
|FlatFileItemWriter|
|HibernateItemWriter|
|JdbcBatchItemWriter|
|JsonFileItemWriter|
|MongoItemWriter|

---

<br>

## <span style="color:gray">References</span>

***📚 [Spring Batch Docs](https://docs.spring.io/spring-batch/docs/current/reference/html/domain.html)***

***📚 [스프링 배치 정리 블로그1](https://www.fwantastic.com/p/spring-batch.html)***

***📚 [스프링 배치 정리 블로그2](https://bcho.tistory.com/763)***

---