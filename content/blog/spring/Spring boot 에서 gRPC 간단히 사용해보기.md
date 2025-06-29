---
tags:
  - gRPC
  - spring
date: 2025-06-29
title: Spring boot 에서 gRPC 간단히 사용해보기
---
최근 회사에서 **gRPC 사용 가능성**에 대한 이야기가 나왔다. 그래서 gRPC를 실제로 어떻게 사용할 수 있을지 간단하게 코드로 구성해보았다.

Java에서 gRPC를 사용할 때 보통은 `net.devh:grpc-spring-boot-starter` 기반으로 구성하는 샘플이 많지만, IntelliJ에서 Spring Boot 프로젝트를 새로 생성해보니 **Spring에서 공식으로 제공하는 `spring-grpc` starter**가 있어 이를 이용해보았다. 아직 버전은 1.0.0 미만이지만, 사용해보기에 충분했고 설정도 비교적 단순했다.

> 설정 관련 내용은 [GitHub 샘플 코드](https://github.com/deuk9/spring-grpc)에 정리해두었다.  
> 이 글에서는 proto 작성부터 서비스 구현까지의 과정을 간단히 정리한다.

## 1. proto 파일 생성

```protobuf
syntax = "proto3";

package hello;
option java_multiple_files = true;
option java_package = "org.example.springgrpc.helloservice.proto";

service HelloService {
  rpc SayHello(HelloRequest) returns (HelloReply);
  rpc StreamHello(HelloRequest) returns (stream StreamHelloReply);
  rpc SayBye(ByeRequest) returns (ByeReply);
}

message HelloRequest {
  string name = 1;
}

message HelloReply {
  repeated string message = 1;
  string byeMessage = 2;
}

message ByeRequest {
  string name = 1;
}

message ByeReply {
  string message = 1;
}

message StreamHelloReply {
  string message = 1;
}

```
- `QueryDSL`과 마찬가지로 `.proto` 파일을 기반으로 Java 코드가 자동 생성된다.
- `package`는 네임스페이스처럼 동작하며, 실제 호출 시 `hello.HelloService.SayHello`처럼 전체 경로가 붙는다.
- `service`는 gRPC에서 제공하는 함수 목록이고, 각 함수의 입력과 반환 타입을 지정한다.
- `stream` 키워드는 스트리밍 응답을 의미한다. 연결이 유지된 채로 여러 데이터를 연속으로 받을 수 있다.
- `message`는 요청/응답 데이터 구조이며, `repeated`는 리스트 형태를 의미한다.

---
## 2. 코드 생성
- `.proto` 파일을 작성한 후 `generateProto` task를 실행하면 Java 코드가 자동으로 생성된다.
- 코드 생성 위치는 `java_package`에 지정한 패키지 기준이다.

---
## 3. 구현

### 3.1 gRPC Client 정의
```java
@Configuration  
public class GrpcClientsConfig {  
  
    @Bean  
    HelloServiceGrpc.HelloServiceBlockingStub stub(GrpcChannelFactory channels) {  
        return HelloServiceGrpc.newBlockingStub(channels.createChannel("local"));  
    }  
  
    @Bean  
    HelloServiceGrpc.HelloServiceFutureStub asyncStub(GrpcChannelFactory channels) {  
        return HelloServiceGrpc.newFutureStub(channels.createChannel("local"));  
    }  
  
}
```

- `GrpcChannelFactory`를 통해 설정한 채널 이름(`local`)을 기준으로 채널을 생성한다. (application.yml 참고)
- 서비스마다 제공되는 `BlockingStub`, `FutureStub` 중 하나를 선택해 Bean으로 등록할 수 있다.

### 3.3 서비스 구현
```java
@Slf4j  
@GrpcService  
@RequiredArgsConstructor  
public class HelloService extends HelloServiceGrpc.HelloServiceImplBase {  
  
    private final HelloServiceBlockingStub stub;  
    private final HelloServiceFutureStub asyncStub;  
  
    @Override  
    public void sayHello(HelloRequest request, StreamObserver<HelloReply> responseObserver) {  
        ListenableFuture<ByeReply> byeFuture = asyncStub.sayBye(  
            ByeRequest.newBuilder()  
                .setName(request.getName())  
                .build());  
  
        log.info("stream request");  
        Iterator<StreamHelloReply> streamHello = stub.streamHello(request);  
        log.info("stream response");  
        try {  
            ByeReply byeReply = byeFuture.get();  
            Builder builder = HelloReply.newBuilder()  
                .setByeMessage(byeReply.getMessage());  
  
            // streamHello Iterator의 각 StreamHelloReply에서 message를 추출하여 추가  
            while (streamHello.hasNext()) {  
                log.info("streamHello.hasNext()");  
                StreamHelloReply reply = streamHello.next();  
                builder.addMessage(reply.getMessage());  
            }  
            log.info("test");  
            HelloReply helloReply = builder.build();  
  
            log.info("HelloReply: {}", helloReply);  
            responseObserver.onNext(helloReply);  
            responseObserver.onCompleted();  
  
        } catch (InterruptedException | ExecutionException e) {  
            throw new RuntimeException(e);  
        }  
    }  
  
    @Override  
    public void streamHello(HelloRequest request,  
        StreamObserver<StreamHelloReply> responseObserver) {  
        for (int i = 0; i < 10; i++) {  
            try {  
                Thread.sleep(2000L);  
            } catch (InterruptedException e) {  
                throw new RuntimeException(e);  
            }  
            responseObserver.onNext(StreamHelloReply.newBuilder()  
                .setMessage("Hello " + request.getName() + " " + i)  
                .build());  
        }  
        try {  
            Thread.sleep(5000L);  
        } catch (InterruptedException e) {  
            throw new RuntimeException(e);  
        }  
        responseObserver.onCompleted();  
    }  
  
    @Override  
    public void sayBye(ByeRequest request, StreamObserver<ByeReply> responseObserver) {  
      responseObserver.onNext(ByeReply.newBuilder()  
           .setMessage("Bye " + request.getName())  
           .build());  
       responseObserver.onCompleted();  
       log.info("bye");  
    }  
}
```

- `@GrpcService`는 gRPC 서버로 등록되기 위한 어노테이션이다.
    (`@Service`만 써도 되지만, 명시적으로 `@GrpcService`를 쓰면 가독성 측면에서 더 낫다.)
- `sayHello` 메서드에서는 `FutureStub`으로 `sayBye`를 비동기 호출하고, `BlockingStub`으로 `streamHello`를 호출하여 응답을 조합한다.
- 처음엔 `stub.streamHello(request)`에서 blocking이 걸릴 줄 알았는데, 실제로는 채널만 열리고, `.next()`로 값을 꺼낼 때 blocking이 발생한다. (다시 생각해보면 당연한 흐름이다.    
- `streamHello`는 2초 간격으로 메시지를 보내는 서버 스트리밍 처리 예제다.
- `sayBye`는 단순한 unary 응답을 처리하며, 비동기로 구현했다.

--- 
## 마무리하며

Spring Boot에서 gRPC를 사용해보는 것은 꽤 간단했다. 공식 Spring starter인 `spring-grpc` 덕분에 설정도 복잡하지 않았고, proto 정의 → 코드 생성 → 서버/클라이언트 구성 → 실행까지 한 번에 정리할 수 있었다.

- [Spring gRPC](https://docs.spring.io/spring-grpc/reference/index.html)
- [샘플코드](https://github.com/deuk9/spring-grpc)