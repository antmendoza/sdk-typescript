/*
 * Copyright 2021-Present The Serverless Workflow Specification Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Builder, builder } from '../builder';
import { Specification } from '../definitions';
import { validate } from '../utils';

/**
 * The internal function used by the builder proxy to validate and return its underlying object
 * @param {Specification.Auth} data The underlying object
 * @returns {Specification.Auth} The validated underlying object
 */
function authBuildingFn(data: Specification.Auth): () => Specification.Auth {
  return () => {
    const model = new Specification.Auth(data);

    validate('Auth', model);
    return model;
  };
}

/**
 * A factory to create a builder proxy for the type `Specification.Auth`
 * @returns {Specification.Auth} A builder for `Specification.Auth`
 */
export function authBuilder(): Builder<Specification.Auth> {
  return builder<Specification.Auth>(authBuildingFn);
}
