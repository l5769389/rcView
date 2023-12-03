from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class keys(_message.Message):
    __slots__ = ["key", "ctrKey", "shiftKey", "altKey"]
    KEY_FIELD_NUMBER: _ClassVar[int]
    CTRKEY_FIELD_NUMBER: _ClassVar[int]
    SHIFTKEY_FIELD_NUMBER: _ClassVar[int]
    ALTKEY_FIELD_NUMBER: _ClassVar[int]
    key: str
    ctrKey: bool
    shiftKey: bool
    altKey: bool
    def __init__(self, key: _Optional[str] = ..., ctrKey: bool = ..., shiftKey: bool = ..., altKey: bool = ...) -> None: ...

class OpRequest(_message.Message):
    __slots__ = ["mouseType", "x", "y", "keys", "deltaX", "deltaY"]
    MOUSETYPE_FIELD_NUMBER: _ClassVar[int]
    X_FIELD_NUMBER: _ClassVar[int]
    Y_FIELD_NUMBER: _ClassVar[int]
    KEYS_FIELD_NUMBER: _ClassVar[int]
    DELTAX_FIELD_NUMBER: _ClassVar[int]
    DELTAY_FIELD_NUMBER: _ClassVar[int]
    mouseType: str
    x: int
    y: int
    keys: keys
    deltaX: int
    deltaY: int
    def __init__(self, mouseType: _Optional[str] = ..., x: _Optional[int] = ..., y: _Optional[int] = ..., keys: _Optional[_Union[keys, _Mapping]] = ..., deltaX: _Optional[int] = ..., deltaY: _Optional[int] = ...) -> None: ...

class Reply(_message.Message):
    __slots__ = ["message"]
    MESSAGE_FIELD_NUMBER: _ClassVar[int]
    message: str
    def __init__(self, message: _Optional[str] = ...) -> None: ...
